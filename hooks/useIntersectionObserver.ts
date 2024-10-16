import { useEffect, useRef, ForwardedRef } from "react";

export function useIntersectionObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {},
  forwardedRef?: ForwardedRef<HTMLDivElement>
) {
  const localRef = useRef<HTMLDivElement>(null);
  const targetRef = forwardedRef || localRef;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback(entry);
      }
    }, options);

    const currentTarget = forwardedRef && 'current' in forwardedRef
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
  }, [callback, options, forwardedRef]);

  return targetRef;
}
