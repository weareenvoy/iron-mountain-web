import mqtt from 'mqtt';

export type MqttError = Error | mqtt.ErrorWithReasonCode;

export type PublishArgsConfig = {
  onError?: (error: Error) => void;
  onSuccess?: () => void;
};

export type DeviceId = 'basecamp' | 'docent-app' | 'kiosk-01' | 'kiosk-02' | 'kiosk-03' | 'overlook' | 'summit';

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
