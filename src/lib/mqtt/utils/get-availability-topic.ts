// Generate availability topic for a device
export const getAvailabilityTopic = (deviceId: string): string => `state/${deviceId}/availability`;
