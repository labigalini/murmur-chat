"use client";

import { useEffect, useRef } from "react";

import { INACTIVE_TIMEOUT } from "@/lib/constants";

export function useInactivityDetection(
  onInactive: () => void,
  onActive?: () => void,
) {
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  useEffect(() => {
    const updateLastActivity = () => {
      setLastActivity(Date.now());
    };

    // Track user interactions
    const events = ["mousedown", "keydown", "touchstart", "mousemove"];
    events.forEach((event) => {
      window.addEventListener(event, updateLastActivity);
    });

    // Check for inactivity
    const interval = setInterval(() => {
      const timeSinceLastActivity = Date.now() - lastActivity;
      if (timeSinceLastActivity > INACTIVE_TIMEOUT) {
        onInactive();
      } else {
        onActive?.();
      }
    }, 60 * 1000); // Check every minute

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, updateLastActivity);
      });
      clearInterval(interval);
    };
  }, [lastActivity, onInactive, onActive]);
}
