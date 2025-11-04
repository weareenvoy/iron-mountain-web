"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  onLabel?: string;
  offLabel?: string;
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, onLabel = "On", offLabel = "Off", ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer data-[state=checked]:bg-primary-im-mid-blue data-[state=unchecked]:bg-primary-im-grey relative inline-flex h-[53.6px] w-[108.87px] shrink-0 cursor-pointer items-center rounded-full px-2 transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
    ref={ref}
  >
    {/* Off label - visible when unchecked, positioned on right side */}
    <span className="text-primary-bg-grey absolute right-5 text-center text-base transition-opacity data-[state=checked]:opacity-0 data-[state=unchecked]:opacity-100">
      {offLabel}
    </span>

    {/* On label - visible when checked, positioned on left side */}
    <span className="text-primary-bg-grey absolute left-5 text-center text-base transition-opacity data-[state=checked]:opacity-100 data-[state=unchecked]:opacity-0">
      {onLabel}
    </span>

    {/* Thumb/Handle */}
    <SwitchPrimitives.Thumb
      className={cn(
        "bg-primary-bg-grey pointer-events-none z-10 block h-[38.52px] w-[38.52px] rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[54px] data-[state=unchecked]:translate-x-0",
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
