import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";

const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center whitespace-nowrap rounded-sm font-regular [&_svg]:pointer-events-none transition-colors disabled:pointer-events-none disabled:cursor-not-allowed shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive duration-300",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-primary text-white hover:bg-brand-hover active:bg-brand-down disabled:text-button-disabled disabled:bg-foreground-secondary",
        secondary:
          "border-2 border-brand-primary text-brand-primary bg-transparent hover:text-white hover:border-brand-hover active:bg-brand-down active:border-brand-down active:text-white hover:bg-[#A7005A50] disabled:text-button-disabled disabled:border-button-disabled",
        ghost:
          "text-brand-primary hover:text-brand-hover active:text-brand-down disabled:text-button-disabled",
        tertiary:
          "border-2 border-border-secondary text-foreground-primary active:text-white active:border-brand-down bg-transparent hover:border-brand-hover hover:text-brand-primary hover-border-primary active:bg-brand-down disabled:text-button-disabled disabled:border-button-disabled backdrop-blur-[2px]",
        "tertiary-invert":
          "border-2 border-background-primary text-background-primary bg-transparent hover:text-brand-primary hover:border-brand-hover active:bg-brand-down active:border-brand-down active:text-white disabled:text-button-disabled disabled:border-button-disabled",
        destructive:
          "bg-destructive text-foreground-primary hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 disabled:text-button-disabled",
        link: "text-(--link) border-2 border-(--link) hover:bg-secondary/80 disabled:text-button-disabled",
        icon: "bg-transparent text-brand-primary hover:text-brand-hover disabled:text-button-disabled",
        unstyled: "",
      },
      size: {
        sm: "h-9 text-sm px-3 [&_svg:not([class*='size-'])]:size-3 gap-1.5",
        md: "h-13 text-2xl px-8 py-4 [&_svg:not([class*='size-'])]:size-4.5 gap-2.5",
        lg: "h-30 text-[40px] px-8 py-6 [&_svg:not([class*='size-'])]:size-6 gap-3.5",
      },
      icon: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "secondary",
        size: "sm",
        className: "border-1",
      },
      {
        variant: "tertiary",
        size: "sm",
        className: "border-1",
      },
      {
        variant: "link",
        size: "sm",
        className: "border-1",
      },
      {
        variant: "secondary",
        icon: true,
        className: "border-3",
      },
      {
        variant: "tertiary",
        icon: true,
        className: "border-3",
      },
      {
        icon: true,
        size: "sm",
        className: "size-9 [&_svg:not([class*='size-'])]:size-4",
      },
      {
        icon: true,
        size: "md",
        className: "size-13 px-4 [&_svg:not([class*='size-'])]:size-5",
      },
      {
        icon: true,
        size: "lg",
        className: "size-18.5 px-6 [&_svg:not([class*='size-'])]:size-9",
      },
    ],
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
  hideIcon = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    active?: boolean;
    asChild?: boolean;
    hideIcon?: boolean;
    icon?: boolean;
  }) {
  const Comp = asChild || variant === "link" ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className, icon }))}
      {...props}
    >
      <span>
        {children}
        {variant === "link" && !hideIcon && <FaArrowUpRightFromSquare />}
      </span>
    </Comp>
  );
}

export { Button, buttonVariants };
