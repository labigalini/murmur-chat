"use client";

import {
  OptionalRestArgsOrSkip,
  useQuery as convex_useQuery,
} from "convex/react";
import { FunctionReference, FunctionReturnType } from "convex/server";

export function useQuery<Query extends FunctionReference<"query">>(
  query: Query,
  ...args: OptionalRestArgsOrSkip<Query>
): FunctionReturnType<Query> | "loading" {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return convex_useQuery(query, ...args) ?? "loading";
}
