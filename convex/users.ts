import { getAuthUserId } from "@convex-dev/auth/server";

import { INACTIVE_TIMEOUT } from "@/lib/constants";

import { query } from "./functions";
import { Ent, QueryCtx } from "./types";

export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    const user = userId !== null ? await ctx.table("users").get(userId) : null;
    return user
      ? {
          ...user,
          name: getUsername(user),
        }
      : null;
  },
});

export function getUsername(user: Ent<"users">) {
  return user.name ?? user.email ?? "noname";
}

export async function getUserSessions(ctx: QueryCtx, user: Ent<"users">) {
  const now = Date.now();
  const sessions = await ctx
    .table("authSessions")
    .filter((q) => q.eq(q.field("userId"), user._id));
  return sessions
    .filter(
      (
        session,
      ): session is NonNullable<typeof session> & {
        publicKey: string;
      } => {
        return !!session && !!session.publicKey;
      },
    )
    .map(({ _id, publicKey, lastUsedTime }) => {
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
