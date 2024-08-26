import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./functions";

export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    return userId !== null ? ctx.table("users").get(userId) : null;
  },
});
