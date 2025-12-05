'use client';

import type { ReactNode } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import type { SummitRecap } from '@/app/(displays)/summit/_types';
import type { RecapTone } from '@/app/(displays)/summit/_components/sections/recap-section';

type RecapPrintSectionProps = {
  readonly actionSlot?: ReactNode;
  readonly placeholder?: string;
  readonly recap: SummitRecap;
  readonly storageKey?: string;
  readonly tone?: RecapTone;
};

const RecapPrintSection = ({ actionSlot, placeholder = '', recap, storageKey, tone }: RecapPrintSectionProps) => {
  const palette = tone ?? {
    accentBg: '#6DCFF6',
    accentColor: '#14477D',
    bodyColor: '#4B4B4D',
    iconColor: '#0D3C69',
    rightTextColor: '#12406A',
  };
  const key = storageKey ?? `summit-recap:${recap.title}`;
  const [note] = useLocalStorage<string>(key, '');
  const noteValue = note.trim().length > 0 ? note : placeholder;
  const rightTextColor = palette.rightTextColor ?? '#12406A';

  return (
    <section className="bg-white flex flex-col gap-0 overflow-hidden rounded-xl shadow-[0_20px_55px_rgba(12,35,80,0.12)] sm:flex-row">
      <div
        className="flex flex-1 flex-col font-semibold gap-4 px-8 py-6 text-lg sm:flex-none sm:px-10 sm:py-8 sm:w-5/12"
        style={{ backgroundColor: palette.accentBg, color: palette.bodyColor }}
      >
        <div className="flex gap-3 items-center" style={{ color: palette.accentColor }}>
          {/* We use span instead of img because we need to pass color to the icon */}
          <span
            aria-hidden
            className="h-8 inline-block w-8"
            style={{
              backgroundColor: palette.iconColor || palette.accentColor,
              mask: 'url(/images/notification-text.svg) no-repeat center / contain',
              WebkitMask: 'url(/images/notification-text.svg) no-repeat center / contain',
            }}
          />
          <span className="font-normal text-3xl">{recap.title}</span>
        </div>
        {actionSlot}
      </div>
      <div className="flex flex-1 px-8 py-6 sm:px-10 sm:py-8">
        <p className="text-base whitespace-pre-line" style={{ color: rightTextColor }}>
          {noteValue || '\u00A0'}
        </p>
      </div>
    </section>
  );
};

export default RecapPrintSection;

