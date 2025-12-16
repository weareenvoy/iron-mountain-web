import type { AudioChannel, AudioController, AudioSettings, LoopOptions, PlaySfxOptions } from '@/lib/audio/types';

const clamp01 = (value: number): number => {
  return Math.max(0, Math.min(1, value));
};

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
  source: AudioBufferSourceNode;
};

export class AudioEngine implements AudioController {
  private audioContext: AudioContext | null = null;

  private readonly buffers = new Map<string, AudioBuffer>();

  private channelGains: null | Record<AudioChannel, GainNode> = null;

  private isUnlockAttempted = false;

  private loopSlots: Record<'ambience' | 'music', LoopSlot> = {
    ambience: null,
    music: null,
  };

  private masterGain: GainNode | null = null;

  private pendingActions: (() => void)[] = [];

  private settings: AudioSettings = defaultSettings;

  private readonly settingsListeners = new Set<(settings: AudioSettings) => void>();

  public getSettings(): AudioSettings {
    return this.settings;
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

  private ensureChannelGains(): Record<AudioChannel, GainNode> {
    if (this.channelGains) return this.channelGains;

    const ctx = this.ensureContext();
    const master = this.ensureMasterGain();

    const ambience = ctx.createGain();
    const music = ctx.createGain();
    const sfx = ctx.createGain();

    ambience.connect(master);
    music.connect(master);
    sfx.connect(master);

    this.channelGains = {
      ambience,
      music,
      sfx,
    };

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

    const start = async () => {
      const ctx = this.ensureContext();
      const channelGain = this.ensureChannelGains()[slot];

      const stopExisting = (existing: LoopSlot) => {
        if (!existing) return;

        const now = ctx.currentTime;
        existing.gain.gain.cancelScheduledValues(now);
        existing.gain.gain.setValueAtTime(existing.gain.gain.value, now);
        existing.gain.gain.linearRampToValueAtTime(0, now + fadeMs / 1000);

        window.setTimeout(() => {
          try {
            existing.source.stop();
            existing.source.disconnect();
            existing.gain.disconnect();
          } catch {
            // ignore
          }
        }, fadeMs + 50);
      };

      const existing = this.loopSlots[slot];

      if (!idOrUrl) {
        stopExisting(existing);
        this.loopSlots[slot] = null;
        return;
      }

      const buffer = await this.loadBuffer(idOrUrl);

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
      loopGain.gain.linearRampToValueAtTime(clamp01(options?.volume ?? 1), now + fadeMs / 1000);

      stopExisting(existing);
      this.loopSlots[slot] = { gain: loopGain, source };
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
