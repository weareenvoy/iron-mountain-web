import type { ExhibitMqttState, OverlookMqttState, SummitMqttState } from '@/lib/mqtt/types';

// TODO Docent state contains all exhibits
export interface DocentAppState {
  readonly exhibits?: {
    readonly basecamp?: ExhibitMqttState;
    readonly overlook?: OverlookMqttState;
    readonly summit?: SummitMqttState;
  };
}

// Sync status from CTRL
export interface SyncState {
  readonly status: 'idle' | 'sync-complete' | 'sync-in-progress';
}

// Mock data structure.
export interface Tour {
  // date and startTime are 1 field or 2 fields?
  readonly date: string;
  readonly endTime: string; // We might not have endTime.
  readonly guestLogo: null | string;
  readonly guestName: string;

  readonly id: string;
  readonly startTime: string;
  readonly title: string; // Is this needed?
}
