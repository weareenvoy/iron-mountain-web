// TODO Docent state contains all exhibits
export interface DocentAppState {
  exhibits?: {
    basecamp?: ExhibitMqttState;
    overlook?: OverlookMqttState;
    summit?: ExhibitMqttState;
  };
}

// Full MQTT state for an exhibit (published to state/<exhibit>)
export interface ExhibitMqttState {
  "tour-id"?: string | null;
  slide: string; // e.g.,   , "welcome-3", "idle", "loading", "error"
  "volume-level": number; // 0.0 to 1.0
  "volume-muted": boolean;
}

// Overlook MQTT state includes video play/pause state
export interface OverlookMqttState extends ExhibitMqttState {
  playpause?: boolean; // Video play/pause state
}

// Sync status from CTRL
export interface SyncState {
  status: "sync-in-progress" | "sync-complete" | "idle";
}

// UI Navigation state for exhibits (local to UI, not MQTT)
export interface ExhibitNavigationState {
  momentId: string; // e.g., "ambient", "welcome", "case-study"
  beatIdx: number;
}

// Used in MomentsAndBeats component.
// A bullet point row is a moment, each moment has multiple beats.
export interface Moment {
  id: string; // e.g., "ambient", "welcome" for basecamp, "case-study" for overlook.
  title: string; // e.g., "Ambient", "Welcome"
  beatCount: number;
}

// Mock data structure.
export interface Tour {
  id: string;
  title: string; // Is this needed?
  guestName: string;
  guestLogo: string | null;

  // date and startTime are 1 field or 2 fields?
  date: string;
  startTime: string;
  endTime: string; // We might not have endTime.
}

export interface BasecampData {
  welcome: { text: string };
  "problem-1": { text: string };
  "problem-2": Array<{ percent: string; percentSubtitle: string }>;
  "problem-3": {
    title: string;
    "challenge-1": { title: string; body: string; icon: string };
    "challenge-2": { title: string; body: string; icon: string };
    "challenge-3": { title: string; body: string; icon: string };
    "challenge-4": { title: string; body: string; icon: string };
  };
  possibilities: { title: string };
  "possibilities-a": {
    title: string;
    "body-1": string;
    "body-2": string;
    "body-3": string;
  };
  "possibilities-b": {
    title: string;
    "body-1": string;
    "body-2": string;
    "body-3": string;
  };
  "possibilities-c": {
    title: string;
    "body-1": string;
    "body-2": string;
    "body-3": string;
  };
}

export type LightControlPreset =
  | "all_lights_on"
  | "show_mode"
  | "all_lights_off";

export enum ToastType {
  Success = 1,
  Warning = 2,
  Error = 3,
}
export interface ToastData {
  type: ToastType;
  message: string;
}
