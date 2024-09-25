import { ComponentProps, ReactNode, useEffect, useMemo, useState } from "react";

import { Skeleton } from "./skeleton";

const SKELETON_PROP = "skeleton";

type HesitateProps<TProps, TValidProps> = (
  | ComponentProps<typeof Skeleton>
  | { [SKELETON_PROP]?: ReactNode }
) & {
  useDelay?: boolean | number;
  component: ReactNode | ((props: TValidProps) => ReactNode);
  props?: TProps;
};

export function Hesitate<
  TProps extends {},
  TValidProps extends {
    [K in keyof TProps]: Exclude<TProps[K], "loading" | undefined | null>;
  },
>({
  useDelay,
  component,
  props: componentProps,
  ...skeletonProps
}: HesitateProps<TProps, TValidProps>) {
  const [showSkeleton, setShowSkeleton] = useState(false);
  const isLoading = useMemo(
    () =>
      componentProps &&
      Object.values(componentProps).some(
        (p) => p === "loading" || p === undefined || p === null,
      ),
    [componentProps],
  );

  useEffect(() => {
    if (isLoading) {
      setShowSkeleton(true);
      return;
    }

    if (showSkeleton) {
      if (useDelay !== false) {
        const delay = typeof useDelay === "number" ? useDelay : 300;
        const timer = setTimeout(() => {
          setShowSkeleton(false);
        }, delay);
        return () => clearTimeout(timer);
      } else {
        setShowSkeleton(false);
      }
      return;
    }
  }, [isLoading, showSkeleton]);

  if (isLoading || showSkeleton) {
    if (SKELETON_PROP in skeletonProps) return skeletonProps[SKELETON_PROP];

    const defaultProps =
      "size" in skeletonProps || "width" in skeletonProps
        ? {}
        : { width: "32" };

    return <Skeleton {...defaultProps} {...skeletonProps} />;
  }

  if (typeof component === "function") {
    return <>{component(componentProps as TValidProps)}</>;
  }

  return <>{component}</>;
}
