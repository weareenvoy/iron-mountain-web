// Helper functions for creating consistent MQTT message structures
export const newId = (source: string): string => `${source}-${Date.now()}`;
