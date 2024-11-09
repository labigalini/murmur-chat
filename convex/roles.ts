import { Infer, v } from "convex/values";

import { internalQuery } from "./functions";
import { QueryCtx } from "./types";

export const vRole = v.union(
  v.literal("Owner"),
  v.literal("Admin"),
  v.literal("Member"),
);
export type Role = Infer<typeof vRole>;

export async function getRole(ctx: QueryCtx, name: Role) {
  return await ctx.table("roles").getX("name", name);
}

export async function getDefaultRole(ctx: QueryCtx) {
  return await ctx
    .table("roles")
    .filter((q) => q.field("isDefault"))
    .firstX();
}

export const get = internalQuery({
  args: { name: v.optional(vRole) },
  async handler(ctx, { name }) {
    if (name) return getRole(ctx, name);
    return getDefaultRole(ctx);
  },
});
