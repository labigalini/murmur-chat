import { ReactNode, useEffect, useMemo, useState } from "react";

import { Skeleton } from "./skeleton";

type LoadingProps<TProps, TValidProps> = {
  fallback?: ReactNode;
  component: (props: TValidProps) => ReactNode;
  props?: TProps;
};

export function Loading<
  TProps extends {},
  TValidProps extends {
    [K in keyof TProps]: Exclude<TProps[K], "loading">;
  },
>({ fallback, component, props }: LoadingProps<TProps, TValidProps>) {
  const [showLoading, setShowLoading] = useState(false);
  const isLoading = useMemo(
    () =>
      props &&
      Object.values(props).some((p) => p === "loading" || p === undefined),
    [props],
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
    return <>{fallback ?? <Skeleton width="32" />}</>;
  }

  return <>{component(props as unknown as TValidProps)}</>;
}
