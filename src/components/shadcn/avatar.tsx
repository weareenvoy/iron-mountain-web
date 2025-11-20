/* eslint-disable react/function-component-definition */

'use client';

import { Fallback, Image, Root } from '@radix-ui/react-avatar';
import { cn } from '@/lib/tailwind/utils/cn';
import type { ComponentProps } from 'react';

function Avatar({ className, ...props }: ComponentProps<typeof Root>) {
  return (
    <Root
      className={cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', className)}
      data-slot="avatar"
      {...props}
    />
  );
}

function AvatarFallback({ className, ...props }: ComponentProps<typeof Fallback>) {
  return (
    <Fallback
      className={cn('flex size-full items-center justify-center rounded-full bg-muted', className)}
      data-slot="avatar-fallback"
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }: ComponentProps<typeof Image>) {
  return (
    <Image
      alt="avatar image"
      className={cn('aspect-square size-full', className)}
      data-slot="avatar-image"
      {...props}
    />
  );
}

export { Avatar, AvatarFallback, AvatarImage };
