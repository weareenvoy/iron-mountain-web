'use client';

import { ArrowRight, CircleAlert, CircleCheck, ExternalLink, Lightbulb, Volume2, VolumeX, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDocent } from '@/app/(tablets)/docent/_components/providers/docent';
import { Button } from '@/app/(tablets)/docent/_components/ui/Button';
import { Switch } from '@/app/(tablets)/docent/_components/ui/Switch';
import { useMqtt } from '@/components/providers/mqtt-provider';
import { useDocentTranslation } from '@/hooks/use-docent-translation';
import { cn } from '@/lib/tailwind/utils/cn';

interface SettingsDrawerProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

interface ExhibitControl {
  readonly errorMessage?: string;
  readonly hasError?: boolean;
  readonly id: string;
  readonly isMuted: boolean;
  readonly isOn: boolean;
  readonly name: string;
}

// TODO Mock data for testing. How to get this data is not implemented yet
const MOCK_EXHIBIT_CONTROLS: ExhibitControl[] = [
  {
    hasError: false,
    id: 'entry-way',
    isMuted: false,
    isOn: true,
    name: 'Entry Way',
  },
  {
    hasError: false,
    id: 'basecamp',
    isMuted: false,
    isOn: true,
    name: 'Basecamp',
  },
  {
    hasError: false,
    id: 'overlook',
    isMuted: true,
    isOn: true,
    name: 'Overlook',
  },
  {
    hasError: false,
    id: 'solution-pathways',
    isMuted: false,
    isOn: true,
    name: 'Solution Pathways',
  },
  {
    errorMessage: 'Offline',
    hasError: true,
    id: 'summit',
    isMuted: false,
    isOn: false,
    name: 'Summit Room',
  },
];

const SettingsDrawer = ({ isOpen, onClose }: SettingsDrawerProps) => {
  const { t } = useDocentTranslation();
  const { client } = useMqtt();
  const { currentTour } = useDocent();
  const router = useRouter();

  // TODO Convert GEC data to exhibit controls for display
  // const exhibitControls: ExhibitControl[] = [];

  const handleToggleMute = (exhibitId: string) => () => {
    if (!client) return;

    // Find current muted state
    const exhibit = MOCK_EXHIBIT_CONTROLS.find(c => c.id === exhibitId);
    if (!exhibit) return;

    // Send setVolume command to GEC
    client.setVolume(exhibitId as 'basecamp' | 'overlook' | 'summit', !exhibit.isMuted, {
      onError: (err: Error) => console.error(`Failed to toggle mute for ${exhibitId}:`, err),
      onSuccess: () => console.info(`Successfully toggled mute for ${exhibitId}`),
    });
  };

  const handleEndTour = () => {
    if (!client || !currentTour) return;

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
        <div className="mt-35 mb-19 flex items-center justify-between">
          <h2 className="text-primary-bg-grey text-4xl leading-[48px]">{t.settings.title}</h2>
          <Button className="-mr-[30px] h-13 gap-2.5 px-5" onClick={onClose} variant="outline-light-grey">
            <X className="size-[24px]" />
            <span className="h-6.25 text-[20px]">{t.docent.actions.close}</span>
          </Button>
        </div>

        {/* Controls List */}
        <div className="space-y-8">
          {MOCK_EXHIBIT_CONTROLS.map(control => (
            <div className="flex h-15 items-center justify-between" key={control.id}>
              <div className="flex flex-col gap-1">
                {/* Status Icon and control name*/}
                <div className="flex items-center gap-2.5">
                  {control.isOn ? (
                    <CircleCheck className="size-[32px] fill-[#8dc13f] stroke-[#2e2e2e]" />
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
                  <span className="text-secondary-im-orange ml-11 text-[16px]">{control.errorMessage}</span>
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

            <span className="text-primary-im-light-blue text-2xl">{t.settings.ebcLights}</span>
          </div>

          {/* Switch to toggle EBC Lights. TODO Is the value from GEC state? */}
          <Switch id="ebc-lights" onCheckedChange={handleToggleEBCLights} useIcon />
        </div>

        {/* End Tour Button */}
        <div className="my-8 border-t border-[#58595B]"></div>
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <Button className="flex h-16 w-full text-xl" onClick={handleEndTour} variant="primary">
            <span>{t.settings.endTourButton}</span>
            <ArrowRight className="size-[24px]" />
          </Button>
          <p className="text-primary-bg-grey w-70 text-[16px] leading-loose tracking-[-0.8px]">
            {t.settings.endTourDescription}
          </p>
        </div>
        {/* Open EBC Manual Link */}
        <Link
          className="text-primary-im-light-blue mt-10.5 flex items-center justify-center gap-3"
          href="https://www.ebcmanual.com"
          target="_blank"
        >
          <ExternalLink className="size-[24px]" />
          <span className="text-[16px] leading-loose">{t.settings.openManual}</span>
        </Link>
      </div>
    </>
  );
};

export default SettingsDrawer;
