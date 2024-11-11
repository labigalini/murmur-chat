"use client";

import { useEffect, useRef } from "react";

import { INACTIVE_TIMEOUT } from "@/lib/constants";

export function useInactivityDetection(
  onInactive: () => void,
  onActive?: (time: number) => void,
  lastUsedTime?: number,
) {
  const lastActivityRef = useRef<number>(Date.now());

  useEffect(() => {
    lastActivityRef.current = lastUsedTime ?? Date.now();
  }, [lastUsedTime]);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    // Check for inactivity
    const interval = setInterval(() => {
      const timeSinceLastActivity = Date.now() - lastActivityRef.current;
      if (timeSinceLastActivity > INACTIVE_TIMEOUT) {
        onInactive();
      } else {
        onActive?.(lastActivityRef.current);
      }
    }, 60 * 1000); // Check every minute

    onActive?.(lastActivityRef.current);

    return () => {
      clearInterval(interval);
    };
  }, [onInactive, onActive]);
}
