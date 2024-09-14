import { convexAuth, getAuthSessionId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";

import { ResendOTP } from "./auth/ResendOTP";
import { mutation, query } from "./functions";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [ResendOTP],
  callbacks: {
    createOrUpdateUser(_ctx, args) {
      if (args.existingUserId) {
        return Promise.resolve(args.existingUserId);
      }
      // Do not allow new users to sign up
      throw new ConvexError("New users not allowed");
    },
  },
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
