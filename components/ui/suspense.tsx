import { ComponentProps, ReactNode, useEffect, useMemo, useState } from "react";

import { NotFoundSkeleton, Skeleton } from "./skeleton";

const SKELETON_PROP = "skeleton";
const FALLBACK_PROP = "fallback";

type SuspenseProps<TProps, TValidProps> = (
  | ComponentProps<typeof Skeleton>
  | { [SKELETON_PROP]?: ReactNode }
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
    if (SKELETON_PROP in props) return props[SKELETON_PROP];

    const defaultProps =
      "size" in props || "width" in props ? {} : { width: "32" };

    return <Skeleton {...defaultProps} {...props} />;
  }

  if (isAnyEmpty) {
    if (FALLBACK_PROP in props) return props[FALLBACK_PROP];

    const defaultProps =
      "size" in props || "width" in props ? {} : { width: "32" };

    return <NotFoundSkeleton {...defaultProps} {...props} />;
  }

  if (typeof component === "function") {
    return <>{component(componentProps as TValidProps)}</>;
  }

  return <>{component}</>;
}
