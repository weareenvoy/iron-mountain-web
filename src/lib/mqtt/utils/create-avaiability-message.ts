export function createAvailabilityMessage(deviceId: string, status: 'online' | 'offline') {
  return {
    meta: {
      id: `${deviceId}-${Date.now()}`,
      ts: new Date().toISOString(),
      source: deviceId,
    },
    body: {
      status,
    },
  };
}
