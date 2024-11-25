import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { INACTIVE_TIMEOUT } from "@/lib/constants";

import { Id } from "./_generated/dataModel";
import { mutation, query } from "./functions";
import { getUrl } from "./storage";
import { Ent, QueryCtx } from "./types";

export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    const user = await ctx.table("users").get(userId);
    if (!user) {
      return null;
    }
    return {
      ...user,
      name: user.name ?? "noname",
      image: user.image && (await getUrl(ctx, user.image)),
    };
  },
});

export const patch = mutation({
  args: {
    name: v.optional(v.string()),
    image: v.optional(v.id("_storage")),
  },
  async handler(ctx, changes) {
    const user = await ctx.table("users").getX(ctx.viewerX()._id);
    if (changes.image && user.image) {
      await ctx.storage.delete(user.image as Id<"_storage">);
    }
    return await user.patch(changes);
  },
});

export async function getUserSessions(ctx: QueryCtx, user: Ent<"users">) {
  const now = Date.now();
  const sessions = await ctx
    .table("authSessions")
    .filter((q) => q.eq(q.field("userId"), user._id));
  const sessionDetails = await Promise.all(
    sessions
      .filter((session) => !!session)
      .map(
        async ({ _id }) =>
          await ctx.table("authSessionDetails").get("sessionId", _id),
      ),
  );
  return sessionDetails
    .filter((session) => !!session)
    .map(({ sessionId: _id, publicKey, lastUsedTime }) => {
      const isInactive = lastUsedTime
        ? now - lastUsedTime > INACTIVE_TIMEOUT
        : true;
      return {
        _id,
        publicKey,
        isInactive,
      };
    });
}
