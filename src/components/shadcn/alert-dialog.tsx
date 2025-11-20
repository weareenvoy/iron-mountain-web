/* eslint-disable react/function-component-definition */

'use client';

import {
  Action,
  Cancel,
  Content,
  Description,
  Overlay,
  Portal,
  Root,
  Title,
  Trigger,
} from '@radix-ui/react-alert-dialog';
import { buttonVariants } from '@/components/shadcn/button';
import { cn } from '@/lib/tailwind/utils/cn';
import type { ComponentProps } from 'react';

function AlertDialog({ ...props }: ComponentProps<typeof Root>) {
  return <Root data-slot="alert-dialog" {...props} />;
}

function AlertDialogAction({ className, ...props }: ComponentProps<typeof Action>) {
  return <Action className={cn(buttonVariants(), className)} {...props} />;
}

function AlertDialogCancel({ className, ...props }: ComponentProps<typeof Cancel>) {
  return <Cancel className={cn(buttonVariants({ variant: 'outline' }), className)} {...props} />;
}

function AlertDialogContent({ className, ...props }: ComponentProps<typeof Content>) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <Content
        className={cn(
          'fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:max-w-lg',
          className
        )}
        data-slot="alert-dialog-content"
        {...props}
      />
    </AlertDialogPortal>
  );
}

function AlertDialogDescription({ className, ...props }: ComponentProps<typeof Description>) {
  return (
    <Description
      className={cn('text-sm text-muted-foreground', className)}
      data-slot="alert-dialog-description"
      {...props}
    />
  );
}

function AlertDialogFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      data-slot="alert-dialog-footer"
      {...props}
    />
  );
}

function AlertDialogHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      data-slot="alert-dialog-header"
      {...props}
    />
  );
}

function AlertDialogOverlay({ className, ...props }: ComponentProps<typeof Overlay>) {
  return (
    <Overlay
      className={cn(
        'fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0',
        className
      )}
      data-slot="alert-dialog-overlay"
      {...props}
    />
  );
}

function AlertDialogPortal({ ...props }: ComponentProps<typeof Portal>) {
  return <Portal data-slot="alert-dialog-portal" {...props} />;
}

function AlertDialogTitle({ className, ...props }: ComponentProps<typeof Title>) {
  return <Title className={cn('text-lg font-semibold', className)} data-slot="alert-dialog-title" {...props} />;
}

function AlertDialogTrigger({ ...props }: ComponentProps<typeof Trigger>) {
  return <Trigger data-slot="alert-dialog-trigger" {...props} />;
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};
