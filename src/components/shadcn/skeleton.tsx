/* eslint-disable react/function-component-definition */

import { cn } from '@/lib/tailwind/utils/cn';
import type { ComponentProps } from 'react';

function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('animate-pulse rounded-md bg-accent', className)} data-slot="skeleton" {...props} />;
}

export { Skeleton };
