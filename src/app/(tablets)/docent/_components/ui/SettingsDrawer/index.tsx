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

interface SettingsDrawerProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

// Exhibit configuration: id, nameKey, and whether it has a mute button
const EXHIBITS = [
  { hasMuteButton: true, id: 'basecamp', nameKey: 'basecamp' },
  { hasMuteButton: false, id: 'welcome-wall', nameKey: 'entryWay' },
  { hasMuteButton: true, id: 'overlook-wall', nameKey: 'overlook' },
  { hasMuteButton: true, id: 'solution-pathways', nameKey: 'solutionPathways' },
  { hasMuteButton: false, id: 'summit', nameKey: 'summitRoom' },
] as const;

type ExhibitId = (typeof EXHIBITS)[number]['id'];

const SettingsDrawer = ({ isOpen, onClose }: SettingsDrawerProps) => {
  const { client } = useMqtt();
  const { data, docentAppState } = useDocent();
  const router = useRouter();

  // Fail fast: CMS-backed strings are required (no runtime fallbacks).
  // This ensures missing CMS fields are caught during development, not silently shipped.
  if (!data) {
    throw new Error('[SettingsDrawer] Missing CMS data. Populate CMS and ensure it loads before rendering.');
  }

  // Build exhibit controls
  const exhibitControls = useMemo(() => {
    return EXHIBITS.map(({ hasMuteButton, id, nameKey }) => {
      const name = data.settings.exhibits[nameKey as keyof typeof data.settings.exhibits];

      // Special handling for solution-pathways: aggregate kiosk-01, kiosk-02, kiosk-03
      if (id === 'solution-pathways') {
        const kiosk01 = docentAppState?.exhibits['kiosk-01'];
        const kiosk02 = docentAppState?.exhibits['kiosk-02'];
        const kiosk03 = docentAppState?.exhibits['kiosk-03'];

        // Track which kiosks are offline
        const offlineKiosks: number[] = [];
        if (!kiosk01?.available) offlineKiosks.push(1);
        if (!kiosk02?.available) offlineKiosks.push(2);
        if (!kiosk03?.available) offlineKiosks.push(3);

        // All 3 must be available to show "online"
        const isOn = offlineKiosks.length === 0;
        // If any is muted, show as muted
        const isMuted = Boolean(kiosk01?.['volume-muted'] || kiosk02?.['volume-muted'] || kiosk03?.['volume-muted']);

        // Build custom offline message showing which kiosks are down
        let offlineMessage: string | undefined;
        if (offlineKiosks.length > 0 && offlineKiosks.length < 3) {
          // Some but not all kiosks are offline - show specific kiosk numbers
          const kioskList =
            offlineKiosks.length === 1
              ? `Kiosk ${offlineKiosks[0]}`
              : `Kiosk ${offlineKiosks.slice(0, -1).join(', ')} & ${offlineKiosks[offlineKiosks.length - 1]}`;
          offlineMessage = `${kioskList} ${offlineKiosks.length === 1 ? 'is' : 'are'} offline`;
        }
        // If all 3 are offline, offlineMessage stays undefined and we use the generic CMS "Offline" text

        return { hasMuteButton, id, isMuted, isOn, name, offlineMessage };
      }

      // Standard exhibits
      const gecKey = id as 'basecamp' | 'overlook-wall' | 'summit' | 'welcome-wall';
      const exhibitState = docentAppState?.exhibits[gecKey as keyof typeof docentAppState.exhibits];

      return {
        hasMuteButton,
        id,
        isMuted: exhibitState?.['volume-muted'] ?? false,
        isOn: exhibitState?.available ?? false,
        name,
        offlineMessage: undefined,
      };
    });
  }, [data, docentAppState]);

  const handleToggleMute = (exhibitId: ExhibitId, currentMuted: boolean) => () => {
    if (!client) return;

    const newMuted = !currentMuted;

    // Special handling for solution-pathways: send to all 3 kiosks
    if (exhibitId === 'solution-pathways') {
      (['kiosk-01', 'kiosk-02', 'kiosk-03'] as const).forEach(kioskId => {
        client.setVolume(kioskId, newMuted, {
          onError: (err: Error) => console.error(`Failed to toggle mute for ${kioskId}:`, err),
          onSuccess: () => console.info(`Successfully toggled mute for ${kioskId}`),
        });
      });
      return;
    }

    client.setVolume(exhibitId as 'basecamp' | 'overlook-wall', newMuted, {
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
            <span className="h-6.25 text-[20px]">{data.docent.actions.back}</span>
          </Button>
          <h2 className="text-primary-bg-grey text-4xl leading-[48px]">{data.settings.title}</h2>
        </div>

        {/* Controls List */}
        <div className="space-y-8">
          {exhibitControls.map(({ hasMuteButton, id, isMuted, isOn, name, offlineMessage }) => (
            <div className="flex h-15 items-center justify-between" key={id}>
              <div className="flex flex-col gap-1">
                {/* Status Icon and control name*/}
                <div className="flex items-center gap-2.5">
                  {isOn ? (
                    <CircleCheck className="size-[32px] fill-[#6dcff6] stroke-[#2e2e2e]" />
                  ) : (
                    <CircleAlert className="size-[32px] fill-[#f7931e] stroke-[#2e2e2e]" />
                  )}
                  <span className={cn('text-2xl', isOn ? 'text-primary-im-light-blue' : 'text-secondary-im-orange')}>
                    {name}
                  </span>
                </div>

                {/* Offline message - use custom message for partial kiosk outages, otherwise CMS default */}
                {!isOn && (
                  <span
                    className={cn(
                      'ml-11 text-[16px]',
                      offlineMessage ? 'text-secondary-im-orange' : 'text-primary-im-grey'
                    )}
                  >
                    {offlineMessage ?? data.settings.status.offline}
                  </span>
                )}
              </div>

              {/* Mute/Unmute Icon Button - only for exhibits with mute support, disabled when offline */}
              {hasMuteButton && (
                <button
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-full transition-colors',
                    isOn && !isMuted ? 'text-primary-im-light-blue' : 'text-primary-im-grey'
                  )}
                  disabled={!isOn}
                  onClick={handleToggleMute(id, isMuted)}
                >
                  {isMuted ? <VolumeX className="size-[24px]" /> : <Volume2 className="size-[24px]" />}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* EBC Lights Button */}
        <div className="my-8 border-t border-[#58595B]"></div>
        <div className="flex h-15 items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Lightbulb icon */}
            <Lightbulb className="size-[28px]" color="#6DCFF6" />

            <span className="text-primary-im-light-blue text-2xl">{data.settings.ebcLights}</span>
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
            <span className="h-5.5">{data.settings.endTourButton}</span>
            <ArrowRight className="size-[24px]" />
          </Button>
          <p className="text-primary-bg-grey min-w-70 text-[16px] leading-loose tracking-[-0.8px]">
            {data.settings.endTourDescription}
          </p>
        </div>
        {/* Open EBC Manual Link */}
        <Link
          className="text-primary-im-light-blue mt-10.5 flex items-center justify-center gap-3"
          href="https://www.ebcmanual.com"
          target="_blank"
        >
          <ExternalLink className="size-[24px]" />
          <span className="text-[16px] leading-loose">{data.settings.openManual}</span>
        </Link>
      </div>
    </>
  );
};

export default SettingsDrawer;
