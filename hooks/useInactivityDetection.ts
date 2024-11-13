"use client";

import { useEffect, useRef, useState } from "react";

import { INACTIVE_TIMEOUT } from "@/lib/constants";

export function useInactivityDetection(
  lastUsedTime?: number,
  onActive?: (timestamp: number) => void,
) {
  const [isInactive, setIsInactive] = useState(false);
  const lastActivityRef = useRef<number>(Date.now());

  useEffect(() => {
    lastActivityRef.current = lastUsedTime ?? Date.now();
    setIsInactive(checkIsInactive(lastActivityRef.current));
  }, [lastUsedTime]);

  useEffect(() => {
    // Do not update last activity if inactive
    if (isInactive) return;

    const updateLastActivity = () => {
      lastActivityRef.current = Date.now();
    };

    // Track user interactions
    const events = ["mousedown", "keydown", "touchstart", "mousemove"];
    events.forEach((event) => {
      window.addEventListener(event, updateLastActivity);
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, updateLastActivity);
      });
    };
  }, [isInactive]);

  useEffect(() => {
    // Check for inactivity
    const interval = setInterval(() => {
      setIsInactive(checkIsInactive(lastActivityRef.current));
      if (!isInactive) onActive?.(lastActivityRef.current);
    }, 60 * 1000); // Check every minute

    onActive?.(lastActivityRef.current);

    return () => {
      clearInterval(interval);
    };
  }, [onActive]);

  return { isInactive };
}

const checkIsInactive = (lastActivityTime: number) => {
  const timeSinceLastActivity = Date.now() - lastActivityTime;
  return timeSinceLastActivity > INACTIVE_TIMEOUT;
};
