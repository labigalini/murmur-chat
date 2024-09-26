import { ComponentProps, ReactNode, useEffect, useMemo, useState } from "react";

import { NotFoundSkeleton, Skeleton } from "./skeleton";

const LOADING_PROP = "loading";
const FALLBACK_PROP = "fallback";

type SuspenseProps<TProps, TValidProps> = (
  | ComponentProps<typeof Skeleton>
  | { [LOADING_PROP]?: ReactNode }
) & {
  [FALLBACK_PROP]?: ReactNode;
  component: ReactNode | ((props: TValidProps) => ReactNode);
  props?: TProps;
  useDelay?: boolean | number;
};

export function Suspense<
  TProps extends {},
  TValidProps extends {
    [K in keyof TProps]: Exclude<TProps[K], "loading" | undefined | null>;
  },
>({
  useDelay,
  component,
  props: componentProps,
  ...props
}: SuspenseProps<TProps, TValidProps>) {
  const [showSkeleton, setShowSkeleton] = useState(false);
  const isAnyLoading = useMemo(
    () =>
      componentProps &&
      Object.values(componentProps).some(
        (p) => p === "loading" || p === undefined,
      ),
    [componentProps],
  );
  const isAnyEmpty = useMemo(
    () =>
      componentProps && Object.values(componentProps).some((p) => p === null),
    [componentProps],
  );

  useEffect(() => {
    if (isAnyLoading) {
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
  }, [isAnyLoading, showSkeleton]);

  if (isAnyLoading || showSkeleton) {
    if (LOADING_PROP in props) return props[LOADING_PROP];
    return <Skeleton {...getSkeletonDefaultProps(props)} {...props} />;
  }

  if (isAnyEmpty) {
    if (FALLBACK_PROP in props) return props[FALLBACK_PROP];
    return <NotFoundSkeleton {...getSkeletonDefaultProps(props)} {...props} />;
  }

  if (typeof component !== "function") return component;
  return component(componentProps as TValidProps);
}

function getSkeletonDefaultProps(props: {}) {
  return "size" in props || "width" in props ? {} : { width: "32" };
}
