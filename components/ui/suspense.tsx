import {
  ComponentProps,
  ComponentType,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Skeleton } from "./skeleton";

type SuspenseProps<TFallbackProps, TComponentProps, TComponentValidProps> = {
  useDelay?: boolean | number;
  skipFallbackOnEmpty?: boolean;
} & {
  fallback?: ComponentType<TFallbackProps>;
  fallbackProps?: TFallbackProps;
} & {
  component: ReactNode | ((props: TComponentValidProps) => ReactNode);
  componentProps?: TComponentProps;
};

export function Suspense<
  TFallbackProps extends ComponentProps<typeof Skeleton>,
  TComponentProps extends {},
  TComponentValidProps extends {
    [K in keyof TComponentProps]: Exclude<
      TComponentProps[K],
      "loading" | undefined | null
    >;
  },
>({
  useDelay = true,
  skipFallbackOnEmpty = false,
  fallback: Fallback,
  fallbackProps,
  component: Component,
  componentProps,
  ...props
}: SuspenseProps<TFallbackProps, TComponentProps, TComponentValidProps>) {
  const [showLoading, setShowLoading] = useState(false);
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
  }, [isAnyLoading, showLoading]);

  if (isAnyLoading || showLoading || isAnyEmpty) {
    if (isAnyEmpty && skipFallbackOnEmpty) return;
    const FallbackComponent = Fallback ?? Skeleton;
    return (
      <FallbackComponent
        variant={isAnyEmpty ? "empty" : "loading"}
        {...(fallbackProps as TFallbackProps)}
      />
    );
  }

  if (typeof Component !== "function") return Component;
  return Component(componentProps as TComponentValidProps);
}
