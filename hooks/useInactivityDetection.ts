"use client";

import { useEffect, useRef } from "react";

import { INACTIVE_TIMEOUT } from "@/lib/constants";

export function useInactivityDetection(
  onInactive: () => void,
  onActive?: () => void,
) {
  const lastActivityRef = useRef<number>(Date.now());

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
        onActive?.();
      }
    }, 60 * 1000); // Check every minute

    onActive?.();

    return () => {
      clearInterval(interval);
    };
  }, [onInactive, onActive]);
}
