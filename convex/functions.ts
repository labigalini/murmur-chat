import { getAuthUserId } from "@convex-dev/auth/server";
import { entsTableFactory } from "convex-ents";
import {
  customCtx,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";

import {
  MutationCtx,
  QueryCtx,
  internalMutation as baseInternalMutation,
  internalQuery as baseInternalQuery,
  mutation as baseMutation,
  query as baseQuery,
} from "./_generated/server";
import { entDefinitions } from "./schema";

export const query = customQuery(
  baseQuery,
  customCtx(async (ctx) => await queryCtx(ctx)),
);

export const internalQuery = customQuery(
  baseInternalQuery,
  customCtx(async (ctx) => await queryCtx(ctx)),
);

export const mutation = customMutation(
  baseMutation,
  customCtx(async (ctx) => await mutationCtx(ctx)),
);

export const internalMutation = customMutation(
  baseInternalMutation,
  customCtx(async (ctx) => await mutationCtx(ctx)),
);

async function queryCtx(baseCtx: QueryCtx) {
  const ctx = {
    ...baseCtx,
    db: undefined,
    table: entsTableFactory(baseCtx, entDefinitions),
  };
  const userId = await getAuthUserId(ctx);
  const viewer = userId === null ? null : await ctx.table("users").get(userId);
  const viewerX = () => {
    if (viewer === null) {
      throw new Error("Expected authenticated viewer");
    }
    return viewer;
  };
  return { ...ctx, viewer, viewerX };
}

async function mutationCtx(baseCtx: MutationCtx) {
  const ctx = {
    ...baseCtx,
    db: undefined,
    table: entsTableFactory(baseCtx, entDefinitions),
  };
  const userId = await getAuthUserId(ctx);
  const viewer = userId === null ? null : await ctx.table("users").get(userId);
  const viewerX = () => {
    if (viewer === null) {
      throw new Error("Expected authenticated viewer");
    }
    return viewer;
  };
  return { ...ctx, viewer, viewerX };
}
