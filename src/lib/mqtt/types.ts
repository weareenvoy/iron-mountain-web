import mqtt from 'mqtt';

export type MqttError = Error | mqtt.ErrorWithReasonCode;

export type PublishArgsConfig = {
  onError?: (error: Error) => void;
  onSuccess?: () => void;
};

export type DeviceId =
  | 'basecamp'
  | 'docent-app'
  | 'kiosk-01'
  | 'kiosk-02'
  | 'kiosk-03'
  | 'overlook-wall'
  | 'summit'
  | 'welcome-wall';

// Exhibits that can receive set-volume commands (cmd/dev/<exhibit>/set-volume)
export type VolumeControllableExhibit = 'basecamp' | 'kiosk-01' | 'kiosk-02' | 'kiosk-03' | 'overlook-wall' | 'summit';

// All exhibits for mute/unmute all
export const ALL_VOLUME_CONTROLLABLE_EXHIBITS: readonly VolumeControllableExhibit[] = [
  'basecamp',
  'kiosk-01',
  'kiosk-02',
  'kiosk-03',
  'overlook-wall',
  'summit',
];

export type MqttServiceConfig = {
  deviceId: DeviceId; // e.g., "docent-app", "basecamp", "kiosk-01"
  onConnectionChange?: (isConnected: boolean) => void;
  onError?: (error: MqttError) => void;
};

export interface MqttMessageMeta {
  id: string;
  source: string;
  ts: string;
}

export interface MqttMessage<T = unknown> {
  body: T;
  meta: MqttMessageMeta;
}

// Full MQTT state for an exhibit (published to state/<exhibit>)
export interface ExhibitMqttStateBase {
  'beat-id': string; // e.g., "ambient-1", "welcome-3", "loading", "error"
  'volume-level': number; // 0.0 to 1.0
  'volume-muted': boolean;
}

// Exhibits do not report this property back to GEC.
export interface ExhibitMqttState extends ExhibitMqttStateBase {
  available: boolean;
}
export interface ExhibitMqttStateSummit extends ExhibitMqttState {
  'tour-id'?: null | string; // Only summit website needs it to fetch the correct data.
}
export interface ExhibitMqttStateOverlook extends ExhibitMqttState {
  'playpause'?: boolean;
  'presentation-mode'?: boolean;
}

export type WelcomeWallState = 'idle' | 'tour';

export interface WelcomeWallMqttState {
  readonly state: WelcomeWallState;
}
