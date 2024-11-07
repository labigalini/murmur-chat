"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Cookie = {
  name: string;
  value: string;
};

// Custom hook to get cookies in the client and return a Map
export function useCookies() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [cookiesMap, setCookiesMap] = useState<Map<string, Cookie>>(new Map());

  // Function to parse cookies from document.cookie and return a Map
  const parseCookies = () => {
    const cookieEntries = document.cookie
      .split("; ")
      .map((cookieString) => {
        const [key, ...rest] = cookieString.split("=");
        const value = rest.join("="); // Join the rest of the cookie value in case it contains '='
        const decodedValue = decodeURIComponent(value);
        return [key, { name: key, value: decodedValue }] as [string, Cookie];
      })
      .filter((entry) => entry[0]); // Filter out invalid cookies (empty keys)

    return new Map<string, Cookie>(cookieEntries);
  };

  useEffect(() => {
    setCookiesMap(parseCookies());
    setIsInitialized(true);
  }, []);

  const setCookie = useCallback(
    (name: string, value: unknown) => {
      const cookie = cookiesMap.get(name);
      const stringValue = JSON.stringify(value);
      if (cookie) cookie.value = stringValue;
      document.cookie = `${name}=${stringValue}`;
    },
    [cookiesMap],
  );

  const cookies = useMemo(
    () => ({
      cookies: isInitialized
        ? cookiesMap
        : ("loading" as "loading" | Map<string, Cookie>),
      setCookie,
    }),
    [cookiesMap, isInitialized, setCookie],
  );

  return cookies;
}
