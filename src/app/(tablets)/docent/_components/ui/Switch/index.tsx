'use client';

import { Root, Thumb } from '@radix-ui/react-switch';
import { useLocale } from '@/app/(tablets)/docent/_components/providers/docent';
import { useDocentTranslation } from '@/hooks/use-docent-translation';
import { cn } from '@/lib/tailwind/utils/cn';
import type { ComponentProps } from 'react';

interface SwitchProps extends ComponentProps<typeof Root> {
  readonly offLabel?: string;
  readonly onLabel?: string;
}

const Switch = ({ className, offLabel, onLabel, ...props }: SwitchProps) => {
  const { t } = useDocentTranslation();
  const lang = useLocale();

  const offLabelText = offLabel == undefined ? t.ui.off : offLabel;
  const onLabelText = onLabel == undefined ? t.ui.on : onLabel;
  const width = lang == 'en' ? 'w-[108.87px]' : 'w-[150px]';
  const translateX =
    lang == 'en'
      ? 'data-[state=checked]:translate-x-[54px] data-[state=unchecked]:translate-x-0'
      : 'data-[state=checked]:translate-x-[94px] data-[state=unchecked]:translate-x-0';

  return (
    <Root
      className={cn(
        'peer data-[state=checked]:bg-primary-im-mid-blue data-[state=unchecked]:bg-primary-im-grey relative inline-flex h-[53.6px] w-[108.87px] shrink-0 cursor-pointer items-center rounded-full px-2 transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        width,
        className
      )}
      {...props}
    >
      {/* Off label - visible when unchecked, positioned on right side */}
      <span className="text-primary-bg-grey absolute right-5 text-center text-base transition-opacity data-[state=checked]:opacity-0 data-[state=unchecked]:opacity-100">
        {offLabelText}
      </span>

      {/* On label - visible when checked, positioned on left side */}
      <span className="text-primary-bg-grey absolute left-5 text-center text-base transition-opacity data-[state=checked]:opacity-100 data-[state=unchecked]:opacity-0">
        {onLabelText}
      </span>

      {/* Thumb/Handle */}
      <Thumb
        className={cn(
          'bg-primary-bg-grey pointer-events-none z-10 block h-[38.52px] w-[38.52px] rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[54px] data-[state=unchecked]:translate-x-0',
          translateX
        )}
      />
    </Root>
  );
};

Switch.displayName = Root.displayName;

export { Switch };
