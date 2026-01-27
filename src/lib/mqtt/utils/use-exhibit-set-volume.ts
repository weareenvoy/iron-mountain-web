import { useEffect, type RefObject } from 'react';
import { getMqttEnvironment } from '@/lib/mqtt/constants';
import type { AudioController } from '@/lib/audio/types';
import type { ExhibitMqttStateBase, VolumeControllableExhibit } from '@/lib/mqtt/types';
import type { MqttService } from '@/lib/mqtt/utils/mqtt-service';

interface UseExhibitSetVolumeArgs<TState extends ExhibitMqttStateBase = ExhibitMqttStateBase> {
  readonly appId: VolumeControllableExhibit;
  readonly audio: AudioController;
  readonly client: MqttService | undefined;
  readonly reportStateRef: RefObject<(next: Partial<TState>) => void>;
  readonly stateRef: RefObject<TState>;
}

// Shared hook to handle set-volume commands for all exhibits. This is used only in basecamp now.
export function useExhibitSetVolume<TState extends ExhibitMqttStateBase = ExhibitMqttStateBase>({
  appId,
  audio,
  client,
  reportStateRef,
  stateRef,
}: UseExhibitSetVolumeArgs<TState>) {
  useEffect(() => {
    if (!client) return;

    const env = getMqttEnvironment();
    const topic = `cmd/${env}/${appId}/set-volume`;

    const handler = (message: Buffer) => {
      try {
        const reportState = reportStateRef.current;
        const state = stateRef.current;

        const msg = JSON.parse(message.toString());
        const muted = msg.body?.['volume-muted'];
        const level = msg.body?.['volume-level'];

        if (typeof muted === 'boolean') audio.setMasterMuted(muted);
        if (typeof level === 'number') audio.setMasterVolume(level);

        // reportState merges with current state. beat-id is included.
        reportState({
          'volume-level': typeof level === 'number' ? level : state['volume-level'],
          'volume-muted': typeof muted === 'boolean' ? muted : state['volume-muted'],
        } as Partial<TState>);
      } catch (error) {
        console.error(`${appId}: Error parsing set-volume command:`, error);
      }
    };

    client.subscribeToTopic(topic, handler);
    return () => client.unsubscribeFromTopic(topic, handler);
  }, [appId, audio, client, reportStateRef, stateRef]);
}
