import {
  OptionalRestArgsOrSkip,
  useQuery as convex_useQuery,
} from "convex/react";
import { FunctionReference, FunctionReturnType } from "convex/server";

export function useQuery<Query extends FunctionReference<"query">>(
  query: Query,
  ...argsOrSkip: OptionalRestArgsOrSkip<Query>
): FunctionReturnType<Query> | "loading" {
  const data = convex_useQuery(query, ...argsOrSkip);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return data === undefined ? "loading" : data;
}
