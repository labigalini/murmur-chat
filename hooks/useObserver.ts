import { ForwardedRef, useEffect, useRef, useState } from "react";

export function useObserver({
  onVisible,
  options = {},
  ref: forwardedRef,
}: {
  onVisible: (entry: IntersectionObserverEntry) => void;
  options?: IntersectionObserverInit;
  ref?: ForwardedRef<HTMLDivElement>;
}) {
  const localRef = useRef<HTMLDivElement>(null);
  const targetRef = forwardedRef || localRef;
  const [isPageVisible, setIsPageVisible] = useState(
    document.visibilityState === "visible",
  );

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(document.visibilityState === "visible");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && isPageVisible) {
        onVisible(entry);
      }
    }, options);

    const currentTarget =
      forwardedRef && "current" in forwardedRef
        ? forwardedRef.current
        : localRef.current;

    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [onVisible, options, forwardedRef, isPageVisible]);

  return targetRef;
}
