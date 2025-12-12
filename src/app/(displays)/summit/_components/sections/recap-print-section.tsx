'use client';

import NotificationTextIcon from '@/components/ui/icons/NotificationTextIcon';
import useLocalStorage from '@/hooks/use-local-storage';
import type { RecapTone } from '@/app/(displays)/summit/_components/sections/recap-section';
import type { ReactNode } from 'react';

type RecapPrintSectionProps = {
  readonly actionSlot?: ReactNode;
  readonly placeholder?: string;
  readonly storageKey: string;
  readonly title?: string;
  readonly tone?: RecapTone;
};

const RecapPrintSection = ({
  actionSlot,
  placeholder = '',
  storageKey,
  title = 'Recap',
  tone,
}: RecapPrintSectionProps) => {
  const palette = tone ?? {
    accentBg: '#6DCFF6',
    accentColor: '#14477D',
    bodyColor: '#4B4B4D',
    iconColor: '#0D3C69',
    rightTextColor: '#12406A',
  };
  const [note] = useLocalStorage<string>(storageKey, '');
  const noteValue = note.trim().length > 0 ? note : placeholder;
  const rightTextColor = palette.rightTextColor ?? '#12406A';

  return (
    <section className="flex flex-col gap-0 overflow-hidden rounded-xl bg-white shadow-[0_20px_55px_rgba(12,35,80,0.12)] sm:flex-row">
      <div
        className="flex flex-1 flex-col items-start gap-3 px-8 py-6 text-lg font-semibold sm:w-5/12 sm:flex-none sm:px-10 sm:py-7"
        style={{ backgroundColor: palette.accentBg, color: palette.bodyColor }}
      >
        <div className="flex items-center gap-2.5" style={{ color: palette.accentColor }}>
          <NotificationTextIcon
            aria-hidden
            className="h-7 w-7"
            style={{ color: palette.iconColor || palette.accentColor }}
          />
          <span className="text-[1.75rem] font-normal">{title}</span>
        </div>
        {actionSlot}
      </div>
      <div className="flex flex-1 px-6 py-6 sm:px-10 sm:py-7">
        <p className="text-base whitespace-pre-line" style={{ color: rightTextColor }}>
          {noteValue || '\u00A0'}
        </p>
      </div>
    </section>
  );
};

export default RecapPrintSection;
