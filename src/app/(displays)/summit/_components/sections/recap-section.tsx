import Image from 'next/image';
import type { SummitRecap } from '@/app/(displays)/summit/_types';
import type { ReactNode } from 'react';

type RecapSectionProps = {
  readonly actionSlot?: ReactNode;
  readonly recap: SummitRecap;
  readonly tone?: {
    accentBg: string;
    accentColor: string;
    bodyColor: string;
    iconColor?: string;
  };
};

const DEFAULT_TONE = {
  accentBg: '#6DCFF6',
  accentColor: '#14477D',
  bodyColor: '#4B4B4D',
  iconColor: '#0D3C69',
} as const;

const RecapSection = ({ actionSlot, recap, tone = DEFAULT_TONE }: RecapSectionProps) => {
  const palette = { ...DEFAULT_TONE, ...tone };

  return (
    <section className="flex flex-col gap-0 overflow-hidden rounded-xl bg-white shadow-[0_20px_55px_rgba(12,35,80,0.12)] sm:flex-row">
      <div
        className="flex flex-1 flex-col items-start gap-4 px-8 py-6 text-lg font-semibold sm:w-5/12 sm:flex-none sm:px-10 sm:py-8"
        style={{ backgroundColor: palette.accentBg, color: palette.accentColor }}
      >
        <div className="flex items-center gap-3">
          <Image
            alt=""
            height={32}
            src="/images/notification-text.svg"
            style={{ filter: `drop-shadow(0 0 0 ${palette.iconColor})` }}
            width={32}
          />
          <span className="text-3xl font-normal">{recap.title}</span>
        </div>
        {actionSlot}
      </div>
      <div
        className="flex flex-1 items-center px-8 py-6 text-base sm:px-10 sm:py-8"
        style={{ color: palette.bodyColor }}
      >
        {recap.body}
      </div>
    </section>
  );
};

export default RecapSection;
