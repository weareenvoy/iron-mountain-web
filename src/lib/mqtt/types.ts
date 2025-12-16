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
  | 'overlook'
  | 'summit'
  | 'welcome-wall';

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
export interface ExhibitMqttState {
  'beat-id': string; // e.g., "ambient-1", "welcome-3", "loading", "error"
  'tour-id'?: null | string;
  'volume-level': number; // 0.0 to 1.0
  'volume-muted': boolean;
}

// Overlook MQTT state includes video play/pause state
export interface OverlookMqttState extends ExhibitMqttState {
  'playpause'?: boolean; // Video play/pause state
  'tour-id'?: null | string;
}

// Full MQTT state for an exhibit (published to state/<exhibit>)
export interface SummitMqttState {
  'journey-map-launched': boolean;
  'slide-idx': number;
  'tour-id'?: null | string;
}
