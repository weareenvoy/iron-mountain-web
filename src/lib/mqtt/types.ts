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
  'playpause'?: boolean; // Only matters to overlook, but every exhibit has this property.
  'tour-id'?: null | string;
  'volume-level': number; // 0.0 to 1.0
  'volume-muted': boolean;
}
export interface ExhibitMqttState extends ExhibitMqttStateBase {
  available: boolean;
}
