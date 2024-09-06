import { useEffect, useRef, useState } from "react";

import { OptionalRestArgsOrSkip, useConvex } from "convex/react";
import {
  type FunctionReference,
  type FunctionReturnType,
  type OptionalRestArgs,
  getFunctionName,
} from "convex/server";

import isDeepEqual from "fast-deep-equal";
import { LRUCache } from "lru-cache";

// LRU means "last recently used"
// this is basically a fancy Map with a limited capacity of 100 items (or however many you want)
// for the sake of saving memory
const cache = new LRUCache<string, NonNullable<unknown>>({
  max: 100,
});

function getCacheKey<Query extends FunctionReference<"query">>(
  query: Query,
  args: OptionalRestArgsOrSkip<Query>,
) {
  // JSON.stringify is basic and misses some edge cases,
  // but is more than good enough for simple cases
  // you might consider a stable stringifier or something like superjson instead
  return JSON.stringify([getFunctionName(query), args]);
}

function getQueryCacheData<Query extends FunctionReference<"query">>(
  query: Query,
  args: OptionalRestArgsOrSkip<Query>,
): FunctionReturnType<Query> | undefined {
  return cache.get(getCacheKey(query, args));
}

function setQueryCacheData<Query extends FunctionReference<"query">>(
  query: Query,
  args: OptionalRestArgsOrSkip<Query>,
  data: FunctionReturnType<Query>,
) {
  cache.set(getCacheKey(query, args), data);
}

function useMemoValue<Query>(
  value: Query,
  isEqual: (prev: Query, next: Query) => unknown = isDeepEqual,
): Query {
  const ref = useRef(value);
  if (!isEqual(value, ref.current)) {
    ref.current = value;
  }
  return ref.current;
}

export function useSuspenseQuery<Query extends FunctionReference<"query">>(
  query: Query,
  ...argsOrSkip: OptionalRestArgsOrSkip<Query>
): FunctionReturnType<Query> | "loading" {
  const skip = argsOrSkip[0] === "skip";
  const args = argsOrSkip as OptionalRestArgs<Query>;

  const convex = useConvex();
  const cacheData = getQueryCacheData(query, args);

  if (skip) {
    setQueryCacheData(query, args, null);
  } else if (cacheData === undefined) {
    throw new Promise<void>((resolve) => {
      const watch = convex.watchQuery(query, ...args);

      const result = watch.localQueryResult();
      if (result !== undefined) {
        setQueryCacheData(query, args, result);
        resolve();
        return;
      }

      const unsubscribe = watch.onUpdate(() => {
        const result = watch.localQueryResult();
        if (result === undefined) {
          throw new Error("No query result");
        }

        setQueryCacheData(query, args, result);
        resolve();
        unsubscribe();
      });
    });
  }

  const [data, setData] = useState(cacheData);

  // useMemoValue makes these arguments stable for useEffect
  const memoQuery = useMemoValue(
    query,
    (a, b) => getFunctionName(a) === getFunctionName(b),
  );
  const memoArgs = useMemoValue(args);

  useEffect(() => {
    if (skip) return;
    const watch = convex.watchQuery(memoQuery, ...memoArgs);
    return watch.onUpdate(() => {
      const result = watch.localQueryResult();
      if (result === undefined) {
        throw new Error("No query result");
      }
      setData(result);
      setQueryCacheData(memoQuery, memoArgs, result);
    });
  }, [convex, memoQuery, memoArgs, skip]);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return data === undefined ? "loading" : data;
}
