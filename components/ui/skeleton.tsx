import { cn } from "@/lib/utils";

type SkeletonPropsIcon = React.HTMLAttributes<HTMLDivElement> & {
  size?: string | number;
};

type SkeletonPropsText = React.HTMLAttributes<HTMLDivElement> & {
  width?: string | number;
};

type SkeletonProps = SkeletonPropsIcon | SkeletonPropsText;

function Skeleton({ className, ...props }: SkeletonProps) {
  const isIconProps = "size" in props;
  const isTextProps = "width" in props;

  const { size, width, ...restProps } = props as SkeletonPropsIcon &
    SkeletonPropsText;

  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-primary/10",
        isIconProps && size && `h-${size} w-${size}`,
        isTextProps && width && `w-${width} h-4`,
        className,
      )}
      {...restProps}
    />
  );
}

export { Skeleton };
