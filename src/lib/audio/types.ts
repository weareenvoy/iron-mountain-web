export type AudioChannel = 'ambience' | 'music' | 'sfx';

export interface AudioChannelSettings {
  readonly muted: boolean;
  readonly volume: number; // 0..1
}

export interface AudioSettings {
  readonly channels: Record<AudioChannel, AudioChannelSettings>;
  readonly masterMuted: boolean;
  readonly masterVolume: number; // 0..1
}

export interface LoopOptions {
  readonly fadeMs?: number;
  readonly restart?: boolean;
  readonly volume?: number; // 0..1 multiplier for that loop
}

export interface PlaySfxOptions {
  readonly allowOverlap?: boolean;
  readonly detuneCents?: number;
  readonly playbackRate?: number;
  readonly volume?: number; // 0..1 multiplier for this play
}

export interface AudioController {
  getSettings: () => AudioSettings;

  isUnlocked: () => boolean;

  playSfx: (idOrUrl: string, options?: PlaySfxOptions) => void;

  setAmbience: (idOrUrl: null | string, options?: LoopOptions) => void;

  setChannelMuted: (channel: AudioChannel, muted: boolean) => void;

  setChannelVolume: (channel: AudioChannel, volume: number) => void;

  setMasterMuted: (muted: boolean) => void;

  setMasterVolume: (volume: number) => void;

  setMusic: (idOrUrl: null | string, options?: LoopOptions) => void;

  unlock: () => Promise<void>;
}
