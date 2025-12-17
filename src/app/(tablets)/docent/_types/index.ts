import type { ExhibitMqttState } from '@/lib/mqtt/types';

export interface DocentAppState {
  readonly exhibits?: {
    readonly basecamp?: ExhibitMqttState;
    readonly overlook?: ExhibitMqttState;
    readonly summit?: ExhibitMqttState;
  };
}

// Sync status from CTRL
export interface SyncState {
  readonly status: 'idle' | 'sync-complete' | 'sync-in-progress';
}
