import { Slot } from "@radix-ui/react-slot";
import { VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const skeletonVariants = cva("", {
  variants: {
    variant: {
      loading: "animate-pulse",
      empty: "crossed-out animate-none",
    },
    layout: {
      icon: "rounded-full",
      text: "rounded-md h-[0.75lh]",
      none: "bg-transparent",
    },
  },
  defaultVariants: {
    variant: "loading",
    layout: "text",
  },
});

type SkeletonProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof skeletonVariants> & {
    size?: string | number;
    asChild?: boolean;
  };

function Skeleton({
  className,
  variant,
  layout,
  size,
  asChild,
  ...props
}: SkeletonProps) {
  const SkeletonComp = asChild ? Slot : "div";
  return (
    <SkeletonComp
      className={cn(
        "inline-flex shrink-0 bg-primary/10",
        size != null && `w-${size} h-${size}`,
        skeletonVariants({ variant, layout: asChild ? "none" : layout }),
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton, skeletonVariants };
