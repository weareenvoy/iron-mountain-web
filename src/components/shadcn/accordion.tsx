'use client';

import { ChevronDownIcon } from 'lucide-react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/tailwind/utils/cn';

export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = AccordionPrimitive.Item;

export const AccordionTrigger = (
  props: ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & { readonly indicator?: React.ReactNode }
) => {
  const { children, className, indicator = <ChevronDownIcon className="size-4" />, ...rest } = props;
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          'group/accordion-trigger flex flex-1 items-center justify-between py-4 font-medium transition-all',
          '[&[data-state=open]>svg]:rotate-180',
          className
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
  children,
  className,
  ...rest
}: ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>) => (
  <AccordionPrimitive.Content
    className={cn(
      'overflow-hidden text-sm',
      'data-[state=open]:animate-accordion-down',
      'data-[state=closed]:animate-accordion-up',
      className
    )}
    {...rest}
  >
    <div className="pt-0 pb-4">{children}</div>
  </AccordionPrimitive.Content>
);

AccordionContent.displayName = AccordionPrimitive.Content.displayName;
