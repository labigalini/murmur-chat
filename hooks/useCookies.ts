import { useEffect, useState } from "react";

type Cookie = {
  name: string;
  value: string;
};

// Custom hook to get cookies in the client and return a Map
export function useCookies() {
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
    // Set cookies map when component mounts
    setCookiesMap(parseCookies());
  }, []);

  return cookiesMap;
}
