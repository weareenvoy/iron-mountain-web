'use client';

import {
  ArrowLeft,
  ArrowRight,
  CircleAlert,
  CircleCheck,
  ExternalLink,
  Lightbulb,
  Volume2,
  VolumeX,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useDocent } from '@/app/(tablets)/docent/_components/providers/docent';
import { Button } from '@/app/(tablets)/docent/_components/ui/Button';
import { Switch } from '@/app/(tablets)/docent/_components/ui/Switch';
import { useMqtt } from '@/components/providers/mqtt-provider';
import { cn } from '@/lib/tailwind/utils/cn';
import type { ExhibitControl } from '@/lib/internal/types';

interface SettingsDrawerProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

// Hardcoded exhibit IDs - these match the dictionary keys
const EXHIBIT_IDS: readonly ('basecamp' | 'entry-way' | 'overlook' | 'solution-pathways' | 'summit')[] = [
  'basecamp',
  'entry-way',
  'overlook',
  'solution-pathways',
  'summit',
] as const;

// Map exhibit IDs to their display name keys in data
const EXHIBIT_NAME_MAP = {
  'basecamp': 'basecamp',
  'entry-way': 'entryWay',
  'overlook': 'overlook',
  'solution-pathways': 'solutionPathways',
  'summit': 'summitRoom',
} as const satisfies Record<(typeof EXHIBIT_IDS)[number], string>;

// Map exhibit IDs to GEC state keys
// TODO: 1.Entry Way is not in GEC state yet. 2.Solution Pathways is 3 kiosks. If 1 kiosk is down, is Solution Pathways considered down?
const GEC_EXHIBIT_KEY_MAP = {
  'basecamp': 'basecamp',
  'entry-way': null,
  'overlook': 'overlook-wall',
  'solution-pathways': null,
  'summit': 'summit',
} as const satisfies Record<(typeof EXHIBIT_IDS)[number], 'basecamp' | 'overlook-wall' | 'summit' | null>;

const SettingsDrawer = ({ isOpen, onClose }: SettingsDrawerProps) => {
  const { client } = useMqtt();
  const { data, docentAppState } = useDocent();
  const router = useRouter();

  // Build exhibit controls from dictionary
  const exhibitControls: ExhibitControl[] = useMemo(() => {
    return EXHIBIT_IDS.map(id => {
      const nameKey = EXHIBIT_NAME_MAP[id];
      const name = data?.settings.exhibits[nameKey as keyof typeof data.settings.exhibits] ?? id;

      const gecExhibitKey = GEC_EXHIBIT_KEY_MAP[id];

      // Get state from GEC if available
      const exhibitState = gecExhibitKey ? docentAppState?.exhibits[gecExhibitKey] : null;
      const isOn = exhibitState?.available ?? false;
      const isMuted = exhibitState?.['volume-muted'] ?? false;
      const hasError = !isOn;

      return {
        errorMessage: hasError ? (data?.settings.status.offline ?? 'Offline') : undefined,
        hasError,
        id,
        isMuted,
        isOn,
        name,
      };
    });
  }, [data, docentAppState]);

  const handleToggleMute = (exhibitId: string) => () => {
    if (!client) return;

    // Find current muted state
    const exhibit = exhibitControls.find(c => c.id === exhibitId);
    if (!exhibit) return;

    // Send setVolume command to GEC
    client.setVolume(exhibitId as 'basecamp' | 'overlook-wall' | 'summit', !exhibit.isMuted, {
      onError: (err: Error) => console.error(`Failed to toggle mute for ${exhibitId}:`, err),
      onSuccess: () => console.info(`Successfully toggled mute for ${exhibitId}`),
    });
  };

  const handleEndTour = () => {
    if (!client) return;

    // Send end-tour command to all exhibits (broadcast)
    client.endTour({
      onError: (err: Error) => console.error('Failed to end tour:', err),
      onSuccess: () => {
        // Go back to home page
        router.push('/docent');
        onClose();
      },
    });
  };

  const handleToggleEBCLights = (checked: boolean) => {
    // This would send MQTT message to control EBC Lights
    console.info('Toggling EBC Lights, will send MQTT message', checked);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="absolute inset-0 z-40 bg-black/50" onClick={onClose} />}

      {/* Drawer */}
      <div
        className={cn(
          'absolute top-0 right-0 z-50 h-full w-[600px] transform bg-[#2e2e2e] px-15 transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="mt-10 mb-19 flex flex-col items-start justify-between gap-18">
          <Button className="-mr-[30px] h-13 gap-2.5 px-5" onClick={onClose} variant="outline-light-grey">
            <ArrowLeft className="size-[24px]" />
            <span className="h-6.25 text-[20px]">{data?.docent.actions.back ?? 'Back'}</span>
          </Button>
          <h2 className="text-primary-bg-grey text-4xl leading-[48px]">{data?.settings.title ?? 'Settings'}</h2>
        </div>

        {/* Controls List */}
        <div className="space-y-8">
          {exhibitControls.map(control => (
            <div className="flex h-15 items-center justify-between" key={control.id}>
              <div className="flex flex-col gap-1">
                {/* Status Icon and control name*/}
                <div className="flex items-center gap-2.5">
                  {control.isOn ? (
                    <CircleCheck className="size-[32px] fill-[#6dcff6] stroke-[#2e2e2e]" />
                  ) : (
                    <CircleAlert className="size-[32px] fill-[#f7931e] stroke-[#2e2e2e]" />
                  )}
                  <span
                    className={cn('text-2xl', control.isOn ? 'text-primary-im-light-blue' : 'text-secondary-im-orange')}
                  >
                    {control.name}
                  </span>
                </div>

                {/* Error message */}
                {control.hasError && (
                  <span className="text-primary-im-grey ml-11 text-[16px]">{control.errorMessage}</span>
                )}
              </div>

              {/* Mute/Unmute Icon Button */}
              <button
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-full transition-colors',
                  control.isMuted ? 'text-primary-im-grey' : 'text-primary-im-light-blue'
                )}
                onClick={handleToggleMute(control.id)}
              >
                {control.isMuted ? <VolumeX className="size-[24px]" /> : <Volume2 className="size-[24px]" />}
              </button>
            </div>
          ))}
        </div>

        {/* EBC Lights Button */}
        <div className="my-8 border-t border-[#58595B]"></div>
        <div className="flex h-15 items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Lightbulb icon */}
            <Lightbulb className="size-[28px]" color="#6DCFF6" />

            <span className="text-primary-im-light-blue text-2xl">{data?.settings.ebcLights ?? 'EBC Lights'}</span>
          </div>

          {/* Switch to toggle EBC Lights - read from GEC state */}
          <Switch
            checked={docentAppState?.['ebc-lights'] ?? false}
            id="ebc-lights"
            onCheckedChange={handleToggleEBCLights}
            useIcon
          />
        </div>

        {/* End Tour Button */}
        <div className="my-8 border-t border-[#58595B]"></div>
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <Button className="flex h-16 w-full text-xl" onClick={handleEndTour} variant="primary">
            <span>{data?.settings.endTourButton ?? 'End tour & activate idle'}</span>
            <ArrowRight className="size-[24px]" />
          </Button>
          <p className="text-primary-bg-grey min-w-70 text-[16px] leading-loose tracking-[-0.8px]">
            {data?.settings.endTourDescription ?? 'Tap to end the experience and bring all screens back to idle mode.'}
          </p>
        </div>
        {/* Open EBC Manual Link */}
        <Link
          className="text-primary-im-light-blue mt-10.5 flex items-center justify-center gap-3"
          href="https://www.ebcmanual.com"
          target="_blank"
        >
          <ExternalLink className="size-[24px]" />
          <span className="text-[16px] leading-loose">{data?.settings.openManual ?? 'Open EBC Manual'}</span>
        </Link>
      </div>
    </>
  );
};

export default SettingsDrawer;
