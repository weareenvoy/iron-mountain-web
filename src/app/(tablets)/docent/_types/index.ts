import type { ExhibitMqttState, OverlookMqttState, SummitMqttState } from '@/lib/mqtt/types';

// TODO Docent state contains all exhibits
export interface DocentAppState {
  exhibits?: {
    basecamp?: ExhibitMqttState;
    overlook?: OverlookMqttState;
    summit?: SummitMqttState;
  };
}

// Sync status from CTRL
export interface SyncState {
  status: 'idle' | 'sync-complete' | 'sync-in-progress';
}

// Mock data structure.
export interface Tour {
  // date and startTime are 1 field or 2 fields?
  date: string;
  endTime: string; // We might not have endTime.
  guestLogo: null | string;
  guestName: string;

  id: string;
  startTime: string;
  title: string; // Is this needed?
}
