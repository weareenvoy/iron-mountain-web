import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import { cn } from '@/lib/tailwind/utils/cn';

// A lot of styles are from previous apps. Will keep modifying this file as we have more design.
const buttonVariants = cva(
  'inline-flex items-center cursor-pointer justify-center rounded-full font-medium [&_svg]:pointer-events-none transition-all disabled:pointer-events-none disabled:cursor-not-allowed shrink-0 [&_svg]:shrink-0 outline-none duration-300',
  {
    defaultVariants: {
      size: 'md',
      variant: 'primary',
    },
    variants: {
      icon: {
        false: '',
        true: '',
      },
      size: {
        lg: 'h-30 border-2 text-[40px] px-8 py-6 gap-3.5',
        md: 'h-22 border-2 text-2xl px-8 py-4 gap-5',
        // md and lg are not used. Docent app only uses sm.
        sm: 'h-13 border-2 text-xl px-6 py-4 gap-3.5',
      },
      variant: {
        'outline':
          'border-primary-im-dark-blue text-primary-im-dark-blue bg-transparent hover:bg-primary-im-mid-blue/10 active:bg-primary-im-mid-blue/20 disabled:opacity-50',
        'outline-light-grey':
          'border-primary-bg-grey text-primary-bg-grey bg-transparent hover:bg-primary-bg-grey/10 active:bg-primary-bg-grey/20 disabled:opacity-50',
        // Generic button styles
        'primary':
          'border-primary-bg-grey bg-primary-bg-grey text-primary-im-dark-blue hover:bg-[#e0e0e0] active:bg-[#d0d0d0] disabled:opacity-50',
        'secondary':
          'border-primary-im-dark-blue bg-primary-im-dark-blue text-primary-bg-grey hover:bg-[#1a5a99] active:bg-[#0f3d6b] disabled:opacity-50',
        'unstyled': '',
      },
    },
  }
);

const Button = ({
  asChild = false,
  children,
  className,
  icon,
  size,
  variant,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    readonly active?: boolean;
    readonly asChild?: boolean;
    readonly icon?: boolean;
  }) => {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp className={cn(buttonVariants({ className, icon, size, variant }))} data-slot="button" {...props}>
      {children}
    </Comp>
  );
};

export { Button, buttonVariants };
