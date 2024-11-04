import { convexAuth, getAuthSessionId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";

import { ResendOTP } from "./auth/ResendOTP";
import { internalMutation, mutation, query } from "./functions";
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
    publicKey: v.optional(v.string()),
    lastUsedTime: v.optional(v.number()),
  },
  handler: async (ctx, { publicKey, lastUsedTime }) => {
    const sessionId = await getAuthSessionId(ctx);
    if (!sessionId) {
      return;
    }
    const patch: Record<string, unknown> = {};
    if (publicKey !== undefined) patch.publicKey = publicKey;
    if (lastUsedTime !== undefined) patch.lastUsedTime = lastUsedTime;
    await ctx.table("authSessions").getX(sessionId).patch(patch);
  },
});

export const removeExpired = internalMutation({
  handler: async (ctx) => {
    const now = Date.now();

    // remove expired refresh tokens
    const expiredTokens = await ctx
      .table("authRefreshTokens")
      .filter((q) => q.lt(q.field("expirationTime"), now));
    console.log({ now });
    await Promise.all(
      expiredTokens.map(async (expiredToken) => expiredToken.delete()),
    );

    // remove expired sessions
    const expiredSessions = await ctx
      .table("authSessions")
      .filter((q) => q.lt(q.field("expirationTime"), now));
    await Promise.all(
      expiredSessions.map(async (expiredSession) => expiredSession.delete()),
    );
  },
});
