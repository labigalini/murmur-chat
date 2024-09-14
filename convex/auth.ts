import { convexAuth, getAuthSessionId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";

import { ResendOTP } from "./auth/ResendOTP";
import { mutation, query } from "./functions";
import { hasInvite } from "./invites";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [ResendOTP],
  callbacks: {
    async createOrUpdateUser(
      ctx,
      { existingUserId, profile: { emailVerified, ...profile } },
    ) {
      const userData = {
        ...(emailVerified ? { emailVerificationTime: Date.now() } : null),
        ...profile,
      };

      if (existingUserId) {
        await ctx.db.patch(existingUserId, userData);
        return Promise.resolve(existingUserId);
      }

      if (profile.email) {
        const emailHasInvite = await hasInvite(ctx, {
          email: profile.email,
        });
        if (emailHasInvite) {
          return await ctx.db.insert("users", userData);
        }
      }

      // If no invites found, prevent new user signup
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
