'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDownIcon } from 'lucide-react';
import { cn } from '@/lib/tailwind/utils/cn';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';

export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = AccordionPrimitive.Item;

export const AccordionTrigger = (
  props: ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & { indicator?: React.ReactNode },
) => {
  const { className, children, indicator = <ChevronDownIcon className="size-4" />, ...rest } = props;
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          'group/accordion-trigger flex flex-1 items-center justify-between py-4 font-medium transition-all',
          '[&[data-state=open]>svg]:rotate-180',
          className,
        )}
        {...rest}
      >
        {children}
        <span className="ml-4 flex items-center justify-center transition-transform">{indicator}</span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
};

AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

export const AccordionContent = ({
  className,
  children,
  ...rest
}: ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>) => (
  <AccordionPrimitive.Content className={cn('overflow-hidden text-sm transition-all', className)} {...rest}>
    <div className="pb-4 pt-0">{children}</div>
  </AccordionPrimitive.Content>
);

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

