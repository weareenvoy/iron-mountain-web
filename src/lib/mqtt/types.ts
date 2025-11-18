import mqtt from 'mqtt';

export type MqttError = Error | mqtt.ErrorWithReasonCode;

export type PublishArgsConfig = {
  onError?: (error: Error) => void;
  onSuccess?: () => void;
};

export type MqttServiceConfig = {
  deviceId: string; // e.g., "docent-app", "basecamp", "kiosk-1"
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
  'slide': string; // e.g.,   , "welcome-3", "idle", "loading", "error"
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
