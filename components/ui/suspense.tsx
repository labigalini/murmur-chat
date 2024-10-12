import {
  ComponentProps,
  ComponentType,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";

import { isAnyEmpty, isAnyLoading } from "@/lib/utils";

import { Skeleton } from "./skeleton";

type SuspenseProps<TFallbackProps, TComponentProps, TComponentValidProps> = {
  useDelay?: boolean | number;
  isLoading?: boolean;
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
  isLoading: initialIsLoading = false,
  skipFallbackOnEmpty = false,
  fallback: Fallback,
  fallbackProps,
  component: Component,
  componentProps,
}: SuspenseProps<TFallbackProps, TComponentProps, TComponentValidProps>) {
  const [showLoading, setShowLoading] = useState(false);
  const isLoading = useMemo(
    () =>
      initialIsLoading ||
      (componentProps && isAnyLoading(...Object.values(componentProps))),
    [initialIsLoading, componentProps],
  );
  const isEmpty = useMemo(
    () => componentProps && isAnyEmpty(...Object.values(componentProps)),
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

  if (isLoading || showLoading || isEmpty) {
    if (isEmpty && skipFallbackOnEmpty) return;
    const FallbackComponent = Fallback ?? Skeleton;
    return (
      <FallbackComponent
        variant={isEmpty ? "empty" : "loading"}
        {...(fallbackProps as TFallbackProps)}
      />
    );
  }

  if (typeof Component !== "function") return Component;
  return Component(componentProps as TComponentValidProps);
}
