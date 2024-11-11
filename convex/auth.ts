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
      const now = Date.now();
      const userData = {
        ...(emailVerified ? { emailVerificationTime: now } : null),
        ...profile,
      };

      if (existingUserId) {
        await ctx.db.patch(existingUserId, userData);
        return Promise.resolve(existingUserId);
      }

      if (profile.email) {
        const { email } = profile;
        const emailHasInvite = await hasInvite(ctx, { email });
        if (emailHasInvite) {
          return await ctx.db.insert("users", {
            ...userData,
            name: `noname #${generateUserHash(email, now)}`,
          });
        }
      }

      // If no invites found, prevent new user signup
      throw new ConvexError("New users not allowed");
    },
  },
});

const generateUserHash = (email: string, timestamp: number): string => {
  const combined = `${email}${timestamp}`;
  // Create a simple hash using string manipulation
  const hash = Array.from(combined)
    .map((char) => char.charCodeAt(0))
    .reduce((acc, curr) => ((acc << 5) - acc + curr) | 0, 0);
  // Convert to alphanumeric and ensure 6 characters
  const alphanumeric = Math.abs(hash).toString(36);
  return alphanumeric.slice(-6).padStart(6, "0");
};

export const session = query({
  args: {},
  handler: async (ctx) => {
    const sessionId = await getAuthSessionId(ctx);
    if (sessionId === null) {
      return null;
    }
    const session = await ctx.table("authSessions").get(sessionId);
    const sessionDetailsFull = await ctx
      .table("authSessionDetails")
      .get("sessionId", sessionId);
    const {
      _id: _0,
      _creationTime: _1,
      sessionId: _2,
      ...sessionDetails
    } = sessionDetailsFull ?? {};
    return {
      ...session,
      ...sessionDetails,
    };
  },
});

export const patchSession = mutation({
  args: {
    publicKey: v.optional(v.string()),
    lastUsedTime: v.optional(v.number()),
  },
  handler: async (ctx, details) => {
    const sessionId = await getAuthSessionId(ctx);
    if (!sessionId) {
      return;
    }

    const table = ctx.table("authSessionDetails");

    const sessionDetails = await table.get("sessionId", sessionId);
    if (sessionDetails) {
      return await sessionDetails.patch(details);
    }

    return await table.insert({ ...details, sessionId });
  },
});

export const removeExpired = internalMutation({
  handler: async (ctx) => {
    const now = Date.now();

    // remove expired refresh tokens
    await Promise.all(
      await ctx
        .table("authRefreshTokens")
        .filter((q) => q.lt(q.field("expirationTime"), now))
        .map(async (expiredToken) => expiredToken.delete()),
    );

    // remove expired sessions
    await Promise.all(
      await ctx
        .table("authSessions")
        .filter((q) => q.lt(q.field("expirationTime"), now))
        .map(async (expiredSession) => expiredSession.delete()),
    );

    // remove orphaned session details
    await Promise.all(
      await ctx.table("authSessionDetails").map(async (s) => {
        const session = await s.edge("authSession").catch(() => null);
        if (session == null) await s.delete();
      }),
    );
  },
});
