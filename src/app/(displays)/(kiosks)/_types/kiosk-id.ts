export type KioskId = 'kiosk-1' | 'kiosk-2' | 'kiosk-3';
export const DEFAULT_KIOSK_ID: KioskId = 'kiosk-1';

/**
 * Kiosk beat-id states for MQTT state reporting.
 * - 'kiosk-idle': Kiosk is on idle/attract screen
 * - 'kiosk-active': Kiosk is in active use (user is interacting)
 */
export type KioskBeatId = 'kiosk-active' | 'kiosk-idle';

/**
 * Complete MQTT state structure for kiosks.
 * Used for state reporting and volume control.
 */
export interface KioskMqttState {
  'beat-id': 'kiosk-active' | 'kiosk-idle';
  'volume-level': number; // 0.0 to 1.0
  'volume-muted': boolean;
}

// This file is used to identify the Kiosk setup and is used to determine which Kiosk to display.
// Every function benefits from knowing which Kiosk it's being displayed on.
