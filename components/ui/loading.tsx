import React from "react";

import { Skeleton } from "./skeleton";

type LoadingProps<TProps, TValidProps> = {
  fallback?: React.ReactNode;
  component: (props: TValidProps) => React.ReactNode;
  props: TProps;
};

export function Loading<
  TProps extends {},
  TValidProps extends {
    [K in keyof TProps]: Exclude<TProps[K], "loading">;
  },
>({ fallback, component, props }: LoadingProps<TProps, TValidProps>) {
  const isLoading = Object.values(props).some(
    (p) => p === "loading" || p === undefined,
  );

  if (isLoading) {
    return <>{fallback ?? <Skeleton width="32" />}</>;
  }

  return <>{component(props as unknown as TValidProps)}</>;
}
