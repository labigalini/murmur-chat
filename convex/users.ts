import { getAuthUserId } from "@convex-dev/auth/server";

import { query } from "./functions";
import { Ent } from "./types";

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
