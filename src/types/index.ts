// TODO all the data types are TBD and will be updated as design + BE are finalized.

// Will there even be a StateData sent from GEC?
export interface StateData {
  // current_tour: Tour;
  // current_basecamp_state: { moment: string, beat: number };
  // current_overlook_state: ...
  // current_kiosk_one_state: ...
  // ...
  // Will settings data  live here? Or nothing.
  light_controls: LightControlPreset;
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
