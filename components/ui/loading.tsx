import { ComponentProps, ReactNode, useEffect, useMemo, useState } from "react";

import { Skeleton } from "./skeleton";

type LoadingProps<TProps, TValidProps> = (
  | ComponentProps<typeof Skeleton>
  | { fallback?: ReactNode }
) & {
  useDelay?: boolean | number;
  component: ReactNode | ((props: TValidProps) => ReactNode);
  props?: TProps;
};

export function Loading<
  TProps extends {},
  TValidProps extends {
    [K in keyof TProps]: Exclude<TProps[K], "loading" | undefined | null>;
  },
>({
  useDelay,
  component,
  props: componentProps,
  ...skeletonProps
}: LoadingProps<TProps, TValidProps>) {
  const [showLoading, setShowLoading] = useState(false);
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
      setShowLoading(true);
      return;
    }

    if (showLoading) {
      if (useDelay !== false) {
        const delay = typeof useDelay === "number" ? useDelay : 300;
        const timer = setTimeout(() => {
          setShowLoading(false);
        }, delay);
        return () => clearTimeout(timer);
      } else {
        setShowLoading(false);
      }
      return;
    }
  }, [isLoading, showLoading]);

  if (isLoading || showLoading) {
    if ("fallback" in skeletonProps) return skeletonProps.fallback;

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
