// Generate availability topic for a device with environment isolation
import { getMqttEnvironment } from '../constants';
import type { DeviceId } from '../types';

export const getAvailabilityTopic = (deviceId: DeviceId): string => {
  const env = getMqttEnvironment();
  return `state/${env}/${deviceId}/availability`;
};
