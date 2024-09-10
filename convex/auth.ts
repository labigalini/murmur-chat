import { convexAuth, getAuthSessionId } from "@convex-dev/auth/server";

import { ResendOTP } from "./auth/ResendOTP";
import { query } from "./functions";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [ResendOTP],
});

export const session = query({
  args: {},
  handler: async (ctx) => {
    const sessionId = await getAuthSessionId(ctx);
    if (sessionId === null) {
      return null;
    }
    return await ctx.table("authSessions").get(sessionId);
  },
});
