import type {
  AudioChannel,
  AudioController,
  AudioSettings,
  DuckChannelOptions,
  LoopOptions,
  PlaySfxOptions,
} from '@/lib/audio/types';

const clamp01 = (value: number): number => {
  return Math.max(0, Math.min(1, value));
};

const DEFAULT_DUCK_FADE_MS = 300;

const defaultSettings: AudioSettings = {
  channels: {
    ambience: {
      muted: false,
      volume: 1,
    },
    music: {
      muted: false,
      volume: 1,
    },
    sfx: {
      muted: false,
      volume: 1,
    },
  },
  masterMuted: false,
  masterVolume: 1,
} as const;

type LoopSlot = null | {
  gain: GainNode;
  isStopping: boolean;
  source: AudioBufferSourceNode;
  url: string;
};

type DuckState = {
  duckTo: number;
  isDucked: boolean;
};

export class AudioEngine implements AudioController {
  private audioContext: AudioContext | null = null;

  private readonly buffers = new Map<string, AudioBuffer>();

  private channelDuckGains: null | Record<AudioChannel, GainNode> = null;

  private channelGains: null | Record<AudioChannel, GainNode> = null;

  private readonly duckState: Record<AudioChannel, DuckState> = {
    ambience: { duckTo: 0, isDucked: false },
    music: { duckTo: 0, isDucked: false },
    sfx: { duckTo: 0, isDucked: false },
  };

  private isUnlockAttempted = false;

  // Tracks the latest request ID per slot. Used to detect stale async completions.
  private readonly loopRequestId: Record<'ambience' | 'music', number> = {
    ambience: 0,
    music: 0,
  };

  private loopSlots: Record<'ambience' | 'music', LoopSlot> = {
    ambience: null,
    music: null,
  };

  private masterGain: GainNode | null = null;

  private pendingActions: (() => void)[] = [];

  private settings: AudioSettings = defaultSettings;

  private readonly settingsListeners = new Set<(settings: AudioSettings) => void>();

  public duckChannel(channel: AudioChannel, isDucked: boolean, options?: DuckChannelOptions): void {
    const run = () => {
      const ctx = this.ensureContext();
      const duckGains = this.ensureChannelDuckGains();

      const fadeMs = options?.fadeMs ?? DEFAULT_DUCK_FADE_MS;
      const duckTo = clamp01(options?.duckTo ?? 0);
      const nextMultiplier = isDucked ? duckTo : 1;

      this.duckState[channel] = { duckTo, isDucked };

      const gain = duckGains[channel].gain;

      // WebAudio ramp (no RAF, no React loops)
      const now = ctx.currentTime;
      const durationS = Math.max(0, fadeMs) / 1000;

      // Cancel any scheduled automation and ramp from the current value.
      gain.cancelScheduledValues(now);
      gain.setValueAtTime(gain.value, now);

      if (durationS === 0) {
        gain.setValueAtTime(nextMultiplier, now);
        return;
      }

      // Smooth linear ramp; `setTargetAtTime` is also fine, linear is more deterministic for short fades.
      gain.linearRampToValueAtTime(nextMultiplier, now + durationS);
    };

    this.runOrQueue(run);
  }

  public getSettings(): AudioSettings {
    return this.settings;
  }

  public isUnlocked(): boolean {
    return this.audioContext?.state === 'running';
  }

  public playSfx(idOrUrl: string, options?: PlaySfxOptions): void {
    const play = async () => {
      const ctx = this.ensureContext();
      const channelGain = this.ensureChannelGains().sfx;

      const buffer = await this.loadBuffer(idOrUrl);

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.detune.value = options?.detuneCents ?? 0;
      source.playbackRate.value = options?.playbackRate ?? 1;

      const instanceGain = ctx.createGain();
      instanceGain.gain.value = clamp01(options?.volume ?? 1);

      source.connect(instanceGain);
      instanceGain.connect(channelGain);

      source.start();

      source.onended = () => {
        try {
          source.disconnect();
          instanceGain.disconnect();
        } catch {
          // ignore
        }
      };
    };

    this.runOrQueue(play);
  }

  public setAmbience(idOrUrl: null | string, options?: LoopOptions): void {
    this.setLoop('ambience', idOrUrl, options);
  }

  public setChannelMuted(channel: AudioChannel, muted: boolean): void {
    this.updateSettings({
      channels: {
        ...this.settings.channels,
        [channel]: {
          ...this.settings.channels[channel],
          muted,
        },
      },
    });
    this.applyGains();
  }

  public setChannelVolume(channel: AudioChannel, volume: number): void {
    this.updateSettings({
      channels: {
        ...this.settings.channels,
        [channel]: {
          ...this.settings.channels[channel],
          volume: clamp01(volume),
        },
      },
    });
    this.applyGains();
  }

  public setMasterMuted(muted: boolean): void {
    this.updateSettings({
      masterMuted: muted,
    });
    this.applyGains();
  }

  public setMasterVolume(volume: number): void {
    this.updateSettings({
      masterVolume: clamp01(volume),
    });
    this.applyGains();
  }

  public setMusic(idOrUrl: null | string, options?: LoopOptions): void {
    this.setLoop('music', idOrUrl, options);
  }

  public subscribeToSettings(listener: (settings: AudioSettings) => void): () => void {
    this.settingsListeners.add(listener);
    listener(this.settings);

    return () => {
      this.settingsListeners.delete(listener);
    };
  }

  public async unlock(): Promise<void> {
    this.isUnlockAttempted = true;
    const ctx = this.ensureContext();

    if (ctx.state !== 'running') {
      try {
        await ctx.resume();
      } catch {
        // Autoplay restrictions: we'll try again on the next user gesture.
        return;
      }
    }

    const actions = this.pendingActions;
    this.pendingActions = [];
    actions.forEach(action => action());
  }

  private applyGains(): void {
    if (!this.masterGain || !this.channelGains) return;

    this.masterGain.gain.value = this.settings.masterMuted ? 0 : clamp01(this.settings.masterVolume);

    (Object.keys(this.channelGains) as AudioChannel[]).forEach(channel => {
      const channelSettings = this.settings.channels[channel];
      this.channelGains![channel].gain.value = channelSettings.muted ? 0 : clamp01(channelSettings.volume);
    });
  }

  private ensureChannelDuckGains(): Record<AudioChannel, GainNode> {
    // Created alongside channelGains, but keep this accessor for clarity.
    this.ensureChannelGains();
    if (!this.channelDuckGains) {
      throw new Error('AudioEngine: channelDuckGains not initialized');
    }
    return this.channelDuckGains;
  }

  private ensureChannelGains(): Record<AudioChannel, GainNode> {
    if (this.channelGains) return this.channelGains;

    const ctx = this.ensureContext();
    const master = this.ensureMasterGain();

    // Settings gains
    const ambience = ctx.createGain();
    const music = ctx.createGain();
    const sfx = ctx.createGain();

    // Duck gains
    const ambienceDuck = ctx.createGain();
    const musicDuck = ctx.createGain();
    const sfxDuck = ctx.createGain();

    // Default duck = 1 (no ducking)
    ambienceDuck.gain.value = 1;
    musicDuck.gain.value = 1;
    sfxDuck.gain.value = 1;

    // Connect: settingsGain -> duckGain -> master
    ambience.connect(ambienceDuck);
    music.connect(musicDuck);
    sfx.connect(sfxDuck);

    ambienceDuck.connect(master);
    musicDuck.connect(master);
    sfxDuck.connect(master);

    this.channelGains = { ambience, music, sfx };
    this.channelDuckGains = { ambience: ambienceDuck, music: musicDuck, sfx: sfxDuck };

    this.applyGains();

    return this.channelGains;
  }

  private ensureContext(): AudioContext {
    if (this.audioContext) return this.audioContext;

    this.audioContext = new AudioContext();

    // Ensure graph exists.
    this.ensureChannelGains();

    return this.audioContext;
  }

  private ensureMasterGain(): GainNode {
    if (this.masterGain) return this.masterGain;

    const ctx = this.ensureContext();
    const master = ctx.createGain();

    master.connect(ctx.destination);
    this.masterGain = master;

    this.applyGains();

    return master;
  }

  private async loadBuffer(idOrUrl: string): Promise<AudioBuffer> {
    const cached = this.buffers.get(idOrUrl);
    if (cached) return cached;

    const ctx = this.ensureContext();
    const res = await fetch(idOrUrl);
    if (!res.ok) {
      throw new Error(`Failed to fetch audio: ${idOrUrl}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

    this.buffers.set(idOrUrl, audioBuffer);

    return audioBuffer;
  }

  private runOrQueue(action: () => Promise<void> | void): void {
    const run = () => {
      void action();
    };

    if (!this.audioContext) {
      // If the app never unlocks audio, we still want to be able to queue.
      this.pendingActions.push(run);
      return;
    }

    if (this.audioContext.state === 'running') {
      run();
      return;
    }

    this.pendingActions.push(run);

    if (this.isUnlockAttempted) {
      void this.unlock();
    }
  }

  private setLoop(slot: 'ambience' | 'music', idOrUrl: null | string, options?: LoopOptions): void {
    const fadeMs = options?.fadeMs ?? 250;
    const restart = options?.restart ?? false;
    const volume = options?.volume === undefined ? null : clamp01(options.volume);
    const volumeOrDefault = volume ?? 1;

    // Bump request ID so any in-flight async work becomes stale.
    // This ensures "last call wins" even when setMusic(null) races with a pending setMusic(url).
    const requestId = ++this.loopRequestId[slot];

    const start = async () => {
      const ctx = this.ensureContext();
      const channelGain = this.ensureChannelGains()[slot];

      const stopExisting = (existing: LoopSlot) => {
        if (!existing) return;
        if (existing.isStopping) return;
        existing.isStopping = true;

        const now = ctx.currentTime;
        const stopAt = now + fadeMs / 1000;
        existing.gain.gain.cancelScheduledValues(now);
        existing.gain.gain.setValueAtTime(existing.gain.gain.value, now);
        existing.gain.gain.linearRampToValueAtTime(0, stopAt);

        const cleanup = () => {
          try {
            existing.source.disconnect();
            existing.gain.disconnect();
          } catch {
            // ignore
          }
        };

        existing.source.onended = cleanup;
        try {
          existing.source.stop(stopAt);
        } catch {
          cleanup();
        }
      };

      // Stop request should invalidate earlier in-flight requests.
      if (!idOrUrl) {
        stopExisting(this.loopSlots[slot]);
        this.loopSlots[slot] = null;
        return;
      }

      // Load buffer FIRST
      const buffer = await this.loadBuffer(idOrUrl);

      // If a newer request happened, do not commit.
      if (this.loopRequestId[slot] !== requestId) return;

      const existing = this.loopSlots[slot];

      // If the requested loop is already playing, keep it running by default.
      // Optionally update its per-loop gain (volume) and/or restart it explicitly.
      if (existing && existing.url === idOrUrl && !restart) {
        if (volume === null) return;
        const now = ctx.currentTime;
        existing.gain.gain.cancelScheduledValues(now);
        existing.gain.gain.setValueAtTime(existing.gain.gain.value, now);
        existing.gain.gain.linearRampToValueAtTime(volume, now + fadeMs / 1000);
        return;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const loopGain = ctx.createGain();
      loopGain.gain.value = 0;

      source.connect(loopGain);
      loopGain.connect(channelGain);

      source.start();

      const now = ctx.currentTime;
      loopGain.gain.cancelScheduledValues(now);
      loopGain.gain.setValueAtTime(0, now);
      loopGain.gain.linearRampToValueAtTime(volumeOrDefault, now + fadeMs / 1000);

      stopExisting(existing);
      this.loopSlots[slot] = { gain: loopGain, isStopping: false, source, url: idOrUrl };
    };

    this.runOrQueue(start);
  }

  private updateSettings(next: Partial<AudioSettings>): void {
    this.settings = {
      ...this.settings,
      ...next,
    };

    this.settingsListeners.forEach(listener => listener(this.settings));
  }
}
