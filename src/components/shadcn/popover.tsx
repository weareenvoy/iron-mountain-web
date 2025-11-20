/* eslint-disable react/function-component-definition */

'use client';

import { Anchor, Content, Portal, Root, Trigger } from '@radix-ui/react-popover';
import { cn } from '@/lib/tailwind/utils/cn';
import type { ComponentProps } from 'react';

function Popover({ ...props }: ComponentProps<typeof Root>) {
  return <Root data-slot="popover" {...props} />;
}

function PopoverAnchor({ ...props }: ComponentProps<typeof Anchor>) {
  return <Anchor data-slot="popover-anchor" {...props} />;
}

function PopoverContent({ align = 'center', className, sideOffset = 4, ...props }: ComponentProps<typeof Content>) {
  return (
    <Portal>
      <Content
        align={align}
        className={cn(
          'z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          className
        )}
        data-slot="popover-content"
        sideOffset={sideOffset}
        {...props}
      />
    </Portal>
  );
}

function PopoverTrigger({ ...props }: ComponentProps<typeof Trigger>) {
  return <Trigger data-slot="popover-trigger" {...props} />;
}

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger };
