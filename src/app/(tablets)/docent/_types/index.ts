import type { ExhibitMqttState } from '@/lib/mqtt/types';

// Full state from state/gec topic
export interface DocentAppState {
  readonly 'ebc-lights'?: boolean;
  readonly 'exhibits'?: {
    readonly 'basecamp': ExhibitMqttState;
    readonly 'overlook-wall'?: ExhibitMqttState;
    readonly 'summit'?: ExhibitMqttState;
  };
  readonly 'tour-id'?: null | string;
}

// Sync status from CTRL
export interface SyncState {
  readonly status: 'idle' | 'sync-complete' | 'sync-in-progress';
}
