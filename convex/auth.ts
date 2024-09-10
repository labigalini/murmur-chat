import { convexAuth, getAuthSessionId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { ResendOTP } from "./auth/ResendOTP";
import { mutation, query } from "./functions";

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

export const patchSession = mutation({
  args: {
    publicKey: v.string(),
  },
  handler: async (ctx, { publicKey }) => {
    const sessionId = await getAuthSessionId(ctx);
    if (sessionId === null) {
      return;
    }
    await ctx.table("authSessions").getX(sessionId).patch({ publicKey });
  },
});
