import { getAuthUserId } from "@convex-dev/auth/server";

import { query } from "./functions";

export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    const user = userId !== null ? await ctx.table("users").get(userId) : null;
    return user
      ? {
          ...user,
          name: user.name ?? user.email ?? "noname",
        }
      : null;
  },
});
