import { Slot } from "@radix-ui/react-slot";
import { VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const skeletonVariants = cva("", {
  variants: {
    variant: {
      loading: "animate-pulse",
      empty: "crossed-out animate-none",
    },
  },
  defaultVariants: {
    variant: "loading",
  },
});

type SkeletonPropsIcon = { size?: string | number; width?: never };
type SkeletonPropsText = { width?: string | number; icon?: never };
type SkeletonProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof skeletonVariants> &
  (SkeletonPropsIcon | SkeletonPropsText) & {
    asChild?: boolean;
  };

function Skeleton({ className, variant, asChild, ...props }: SkeletonProps) {
  const isIconProps = "size" in props;
  const isTextProps = "width" in props;

  const { size, width, ...restProps } = props as SkeletonPropsIcon &
    SkeletonPropsText;

  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      className={cn(
        skeletonVariants({ variant }),
        "inline-flex shrink-0 rounded-md bg-primary/10",
        isIconProps && size && `h-${size} w-${size} rounded-full`,
        isTextProps && width && `w-${width} h-[0.5lh]`,
        className,
      )}
      {...restProps}
    />
  );
}

export { Skeleton };
