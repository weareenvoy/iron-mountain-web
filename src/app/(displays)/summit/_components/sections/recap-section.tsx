import NotificationTextIcon from '@/components/ui/icons/NotificationTextIcon';
import useLocalStorage from '@/hooks/use-local-storage';
import type { SummitRecap } from '@/app/(displays)/summit/_types';
import type { ChangeEvent, ReactNode } from 'react';

type RecapSectionProps = {
  readonly actionSlot?: ReactNode;
  readonly placeholder?: string;
  readonly recap: SummitRecap;
  readonly storageKey?: string;
  readonly tone?: {
    accentBg: string;
    accentColor: string;
    bodyColor: string;
    iconColor?: string;
    rightTextColor?: string;
  };
};

const DEFAULT_TONE = {
  accentBg: '#6DCFF6',
  accentColor: '#14477D',
  bodyColor: '#4B4B4D',
  iconColor: '#0D3C69',
} as const;

const RecapSection = ({ actionSlot, placeholder = '', recap, storageKey, tone = DEFAULT_TONE }: RecapSectionProps) => {
  const palette = { ...DEFAULT_TONE, ...tone };
  const iconColor = palette.iconColor;
  const key = storageKey ?? `summit-recap:${recap.title}`;
  const [note, setNote] = useLocalStorage<string>(key, '');
  const rightTextColor = palette.rightTextColor ?? '#12406A';

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setNote(event.target.value);
  };

  return (
    <section className="flex flex-col gap-0 overflow-hidden rounded-xl bg-white shadow-[0_20px_55px_rgba(12,35,80,0.12)] sm:flex-row">
      <div
        className="flex flex-1 flex-col items-start gap-4 px-8 py-6 text-lg font-semibold sm:w-5/12 sm:flex-none sm:px-10 sm:py-8"
        style={{ backgroundColor: palette.accentBg, color: palette.bodyColor }}
      >
        <div className="flex items-center gap-3" style={{ color: palette.accentColor }}>
          <NotificationTextIcon aria-hidden className="h-8 w-8" style={{ color: iconColor }} />
          <span className="text-3xl font-normal">{recap.title}</span>
        </div>
        {actionSlot}
      </div>
      <div className="flex flex-1 px-8 py-6 sm:px-10 sm:py-8">
        <textarea
          className="h-28 w-full resize-none rounded-lg border border-transparent bg-transparent text-base outline-none focus:border-[#12406A]/30"
          onChange={handleChange}
          placeholder={placeholder}
          style={{ color: rightTextColor }}
          value={note}
        />
      </div>
    </section>
  );
};

export default RecapSection;
