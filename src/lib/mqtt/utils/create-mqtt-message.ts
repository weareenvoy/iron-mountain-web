import { newId } from './new-id';
import { nowTs } from './now-ts';
import type { MqttMessage } from '../types';

// Helper to create a properly formatted MQTT message
export const createMqttMessage = <T>(source: string, body: T): MqttMessage<T> => {
  return {
    body,
    meta: {
      id: newId(source),
      source,
      ts: nowTs(),
    },
  };
};
