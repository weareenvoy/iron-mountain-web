// Generate availability topic for a device with environment isolation
import { getMqttEnvironment, type MqttEnvironment } from '../constants';
import type { DeviceId } from '../types';

/**
 * Generate environment-specific availability topic for a device.
 *
 * @param deviceId - The device identifier
 * @returns Topic string in format: state/{env}/{deviceId}/availability
 *
 * @example
 * // In production:
 * getAvailabilityTopic('kiosk-01') // => 'state/production/kiosk-01/availability'
 *
 * // In local:
 * getAvailabilityTopic('kiosk-01') // => 'state/local/kiosk-01/availability'
 */
export const getAvailabilityTopic = (deviceId: DeviceId): string => {
  const env: MqttEnvironment = getMqttEnvironment();
  return `state/${env}/${deviceId}/availability`;
};
