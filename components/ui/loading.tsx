import { ComponentProps, ReactNode, useEffect, useMemo, useState } from "react";

import { Skeleton } from "./skeleton";

type LoadingProps<TProps, TValidProps> = (
  | ComponentProps<typeof Skeleton>
  | { fallback?: ReactNode }
) & {
  component: ReactNode | ((props: TValidProps) => ReactNode);
  props?: TProps;
};

export function Loading<
  TProps extends {},
  TValidProps extends {
    [K in keyof TProps]: Exclude<TProps[K], "loading">;
  },
>({
  component,
  props: componentProps,
  ...skeletonProps
}: LoadingProps<TProps, TValidProps>) {
  const [showLoading, setShowLoading] = useState(false);
  const isLoading = useMemo(
    () =>
      componentProps &&
      Object.values(componentProps).some(
        (p) => p === "loading" || p === undefined,
      ),
    [componentProps],
  );

  useEffect(() => {
    if (isLoading) {
      setShowLoading(true);
    } else if (showLoading) {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, showLoading]);

  if (isLoading || showLoading) {
    return (
      <>
        {"fallback" in skeletonProps ? (
          skeletonProps.fallback
        ) : (
          <Skeleton width="32" {...skeletonProps} />
        )}
      </>
    );
  }

  if (typeof component === "function") {
    return <>{component(componentProps as TValidProps)}</>;
  }

  return <>{component}</>;
}
