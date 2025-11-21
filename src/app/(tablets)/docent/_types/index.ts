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
