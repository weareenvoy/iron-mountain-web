/* eslint-disable react/function-component-definition */

'use client';

import { Root } from '@radix-ui/react-separator';
import { cn } from '@/lib/tailwind/utils/cn';
import type { ComponentProps } from 'react';

function Separator({
  className,
  decorative = true,
  orientation = 'horizontal',
  ...props
}: ComponentProps<typeof Root>) {
  return (
    <Root
      className={cn(
        'shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
        className
      )}
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      {...props}
    />
  );
}

export { Separator };
