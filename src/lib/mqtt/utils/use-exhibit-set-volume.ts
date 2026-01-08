import { useEffect, type RefObject } from 'react';
import type { AudioController } from '@/lib/audio/types';
import type { ExhibitMqttStateBase, VolumeControllableExhibit } from '@/lib/mqtt/types';
import type { MqttService } from '@/lib/mqtt/utils/mqtt-service';

interface UseExhibitSetVolumeArgs {
  readonly appId: VolumeControllableExhibit;
  readonly audio: AudioController;
  readonly client: MqttService | undefined;
  readonly reportStateRef: RefObject<(next: Partial<ExhibitMqttStateBase>) => void>;
  readonly stateRef: RefObject<ExhibitMqttStateBase>;
}

// Shared hook to handle set-volume commands for all exhibits. This is used only in basecamp now.
export function useExhibitSetVolume({ appId, audio, client, reportStateRef, stateRef }: UseExhibitSetVolumeArgs) {
  useEffect(() => {
    if (!client) return;

    const topic = `cmd/dev/${appId}/set-volume`;

    const handler = (message: Buffer) => {
      try {
        const msg = JSON.parse(message.toString());
        const muted = msg.body?.['volume-muted'];
        const level = msg.body?.['volume-level'];

        if (typeof muted === 'boolean') audio.setMasterMuted(muted);
        if (typeof level === 'number') audio.setMasterVolume(level);

        // reportState merges with current state. beat-id is included.
        reportStateRef.current({
          'volume-level': typeof level === 'number' ? level : stateRef.current['volume-level'],
          'volume-muted': typeof muted === 'boolean' ? muted : stateRef.current['volume-muted'],
        });
      } catch (error) {
        console.error(`${appId}: Error parsing set-volume command:`, error);
      }
    };

    client.subscribeToTopic(topic, handler);
    return () => client.unsubscribeFromTopic(topic, handler);
  }, [appId, audio, client, reportStateRef, stateRef]);
}
