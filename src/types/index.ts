// TODO all the data types are TBD and will be updated as design + BE are finalized.
export type BaseCampState =
  | "IDLE"
  | "BASECAMP_INTRO"
  | "PROBLEM"
  | "PROBLEM_KPIS"
  // ...
  | "OUTRO";

export type OverlookState =
  | "IDLE"
  | "OVERLOOK_INTRO"
  | "PROTECT_INTRO"
  | "PROTECT_DETAILS"
  // ....
  | "OUTRO";
export interface StateData {
  current_basecamp_state: BaseCampState;
  current_overlook_state: OverlookState;
  // current_kiosk_one_state: ...
  // ...
  // Everything in Settings might live here too.
  light_controls: LightControlPreset;
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
