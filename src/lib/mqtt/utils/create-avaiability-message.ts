export function createAvailabilityMessage(deviceId: string, status: 'offline' | 'online') {
  return {
    body: {
      status,
    },
    meta: {
      id: `${deviceId}-${Date.now()}`,
      source: deviceId,
      ts: new Date().toISOString(),
    },
  };
}
