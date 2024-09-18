import * as React from "react";

import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@/lib/utils";

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> & {
    label?: string;
  }
>(
  (
    {
      className,
      orientation = "horizontal",
      decorative = true,
      label,
      ...props
    },
    ref,
  ) => (
    <div className="relative">
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={cn(
          "shrink-0 bg-border",
          orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
          className,
        )}
        {...props}
      />
      {label && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-background px-2 text-xs uppercase">{label}</span>
        </div>
      )}
    </div>
  ),
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
