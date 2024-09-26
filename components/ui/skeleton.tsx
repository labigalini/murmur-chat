import { cn } from "@/lib/utils";

type SkeletonPropsIcon = { size?: string | number };

type SkeletonPropsText = { width?: string | number };

type SkeletonProps = React.HTMLAttributes<HTMLDivElement> &
  (SkeletonPropsIcon | SkeletonPropsText);

function Skeleton({ className, ...props }: SkeletonProps) {
  const isIconProps = "size" in props;
  const isTextProps = "width" in props;

  const { size, width, ...restProps } = props as SkeletonPropsIcon &
    SkeletonPropsText;

  return (
    <div
      className={cn(
        "inline-flex animate-pulse rounded-md bg-primary/10",
        isIconProps && size && `h-${size} w-${size} rounded-full`,
        isTextProps && width && `w-${width} h-[0.5lh]`,
        className,
      )}
      {...restProps}
    />
  );
}

function NotFoundSkeleton({ className, ...props }: SkeletonProps) {
  return (
    <Skeleton
      className={cn("crossed-out animate-none", className)}
      {...props}
    />
  );
}

export { NotFoundSkeleton, Skeleton };
