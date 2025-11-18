// Generate device-specific client ID
export const generateClientId = (deviceId: string): string =>
  `${deviceId}-${Math.random().toString(16).substring(2, 10)}`;
