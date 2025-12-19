import type { ExhibitMqttState, ExhibitMqttStateOverlook, ExhibitMqttStateSummit } from '@/lib/mqtt/types';

// Full state from state/gec topic
export interface DocentAppState {
  readonly 'ebc-lights'?: boolean;
  readonly 'exhibits'?: {
    readonly 'basecamp': ExhibitMqttState;
    readonly 'overlook-wall'?: ExhibitMqttStateOverlook;
    readonly 'summit'?: ExhibitMqttStateSummit;
  };
  readonly 'tour-id'?: null | string;
}

// Sync status from CTRL
export interface SyncState {
  readonly status: 'idle' | 'sync-complete' | 'sync-in-progress';
}
