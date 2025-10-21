import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// A lot of styles are from previous apps. Will keep modifying this file as we have more design.
const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center whitespace-nowrap rounded-full font-medium [&_svg]:pointer-events-none transition-all disabled:pointer-events-none disabled:cursor-not-allowed shrink-0 [&_svg]:shrink-0 outline-none duration-300",
  {
    variants: {
      variant: {
        // Generic button styles
        primary:
          "border border-primary-bg-grey bg-primary-bg-grey text-primary-im-dark-blue hover:bg-[#e0e0e0] active:bg-[#d0d0d0] disabled:opacity-50",
        secondary:
          "border border-primary-im-dark-blue bg-primary-im-dark-blue text-primary-bg-grey hover:bg-[#1a5a99] active:bg-[#0f3d6b] disabled:opacity-50",
        "outline-white":
          "border border-white text-white bg-transparent hover:bg-white/10 active:bg-white/20 disabled:opacity-50",
        outline:
          "border border-primary-im-dark-blue text-primary-im-dark-blue bg-transparent hover:bg-primary-im-mid-blue/10 active:bg-primary-im-mid-blue/20 disabled:opacity-50",
        unstyled: "",
      },
      size: {
        sm: "h-12 border-1 text-sm px-3 [&_svg:not([class*='size-'])]:size-3 gap-1.5",
        md: "h-22 border-2 text-2xl px-8 py-4 [&_svg:not([class*='size-'])]:size-4.5 gap-2.5",
        lg: "h-30 text-[40px] px-8 py-6 [&_svg:not([class*='size-'])]:size-6 gap-3.5",
      },
      icon: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  icon,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    active?: boolean;
    asChild?: boolean;
    icon?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className, icon }))}
      {...props}
    >
      {children}
    </Comp>
  );
}

export { Button, buttonVariants };
