// Generate availability topic for a device
import type { DeviceId } from '../types';

export const getAvailabilityTopic = (deviceId: DeviceId): string => `state/${deviceId}/availability`;
