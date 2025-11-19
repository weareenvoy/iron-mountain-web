/* eslint-disable react/function-component-definition */

import { cn } from '@/lib/tailwind/utils/cn';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('animate-pulse rounded-md bg-accent', className)} data-slot="skeleton" {...props} />;
}

export { Skeleton };
