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
  <div className="flex items-center gap-2 text-2xl">
    <div>{offLabel}</div>

    <SwitchPrimitives.Root
      className={cn(
        "peer data-[state=checked]:bg-brand-primary data-[state=unchecked]:bg-input focus-visible:ring-ring focus-visible:ring-offset-background border-foreground-primary inline-flex h-12.5 w-22.5 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block h-8 w-8 rounded-full bg-white ring-0 transition-transform data-[state=checked]:translate-x-12 data-[state=unchecked]:translate-x-2",
        )}
      />
    </SwitchPrimitives.Root>

    <div>{onLabel}</div>
  </div>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
