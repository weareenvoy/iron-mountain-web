'use client';

import { ChevronDownIcon } from 'lucide-react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { cn } from '@/lib/tailwind/utils/cn';
import type { ComponentPropsWithoutRef } from 'react';

export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = AccordionPrimitive.Item;

type AccordionTriggerProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
  readonly 'data-accordion-color'?: 'blue' | 'lightBlue' | 'navy' | 'white';
  readonly 'indicator'?: React.ReactNode;
};

export const AccordionTrigger = (props: AccordionTriggerProps) => {
  const {
    children,
    className,
    'data-accordion-color': accordionColor,
    indicator = <ChevronDownIcon className="size-4" />,
    ...rest
  } = props;

  return (
    <AccordionPrimitive.Header
      className={cn(
        'flex',
        'data-[accordion-color=blue]:bg-[#1b75bc]',
        'data-[accordion-color=lightBlue]:bg-[#6dcff6]',
        'data-[accordion-color=navy]:bg-[#14477d]',
        'data-[accordion-color=white]:bg-[#ededed]'
      )}
      data-accordion-color={accordionColor}
    >
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
      'data-[state=closed]:animate-accordion-up',
      'data-[state=open]:animate-accordion-down',
      className
    )}
    {...rest}
  >
    <div className="pt-0">{children}</div>
  </AccordionPrimitive.Content>
);

AccordionContent.displayName = AccordionPrimitive.Content.displayName;
