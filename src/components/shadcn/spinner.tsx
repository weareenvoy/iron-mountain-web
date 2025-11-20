/* eslint-disable react/function-component-definition */

import { Loader2Icon } from 'lucide-react';
import { cn } from '@/lib/tailwind/utils/cn';
import type { ComponentProps } from 'react';

function Spinner({ className, ...props }: ComponentProps<'svg'>) {
  return <Loader2Icon aria-label="Loading" className={cn('size-4 animate-spin', className)} role="status" {...props} />;
}

export { Spinner };
