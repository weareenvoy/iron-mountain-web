'use client';

import { Lightbulb, LightbulbOff } from 'lucide-react';
import { Root, Thumb } from '@radix-ui/react-switch';
import { useDocent } from '@/app/(tablets)/docent/_components/providers/docent';
import { cn } from '@/lib/tailwind/utils/cn';
import type { ComponentProps } from 'react';

interface SwitchProps extends ComponentProps<typeof Root> {
  readonly offLabel?: string;
  readonly onLabel?: string;
  readonly useIcon?: boolean;
}

const Switch = ({ className, offLabel, onLabel, useIcon, ...props }: SwitchProps) => {
  const { data, locale } = useDocent();

  const offLabelText = offLabel == undefined ? (data?.ui.off ?? 'Off') : offLabel;
  const onLabelText = onLabel == undefined ? (data?.ui.on ?? 'On') : onLabel;
  const width = locale == 'en' || useIcon ? 'w-[108.87px]' : 'w-[150px]';
  const translateX =
    locale == 'en' || useIcon
      ? 'data-[state=checked]:translate-x-[54px] data-[state=unchecked]:translate-x-0'
      : 'data-[state=checked]:translate-x-[94px] data-[state=unchecked]:translate-x-0';

  return (
    <Root
      className={cn(
        'peer group data-[state=checked]:bg-primary-im-mid-blue relative inline-flex h-[53.6px] shrink-0 cursor-pointer items-center rounded-full px-2 transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=unchecked]:bg-[#151515]',
        width,
        className
      )}
      {...props}
    >
      {/* Off label - visible when unchecked, positioned on right side */}
      <span className="text-primary-im-grey absolute right-5 text-center text-base transition-opacity group-data-[state=checked]:opacity-0 group-data-[state=unchecked]:opacity-100">
        {useIcon ? <LightbulbOff className="size-[24px]" /> : offLabelText}
      </span>

      {/* On label - visible when checked, positioned on left side */}
      <span className="text-primary-bg-grey absolute left-5 text-center text-base transition-opacity group-data-[state=checked]:opacity-100 group-data-[state=unchecked]:opacity-0">
        {useIcon ? <Lightbulb className="size-[24px]" /> : onLabelText}
      </span>

      {/* Thumb/Handle */}
      <Thumb
        className={cn(
          'data-[state=checked]:bg-primary-bg-grey data-[state=unchecked]:bg-primary-im-grey pointer-events-none z-10 block h-[38.52px] w-[38.52px] rounded-full ring-0 transition-transform',
          translateX
        )}
      />
    </Root>
  );
};

Switch.displayName = Root.displayName;

export { Switch };
