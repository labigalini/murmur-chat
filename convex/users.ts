import { internalMutation, mutation } from "./functions";

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Called api.auth.users.store without valid auth token");
    }

    let user = await ctx
      .table("users")
      .get("tokenIdentifier", identity.tokenIdentifier);

    if (user !== null) {
      return user;
    }

    if (identity.email === undefined) {
      throw new Error("User does not have an email address");
    }

    user = await ctx.table("users").get("email", identity.email);
    const nameFallback = emailUserName(identity.email);
    const userFields = {
      fullName: identity.name ?? nameFallback,
      tokenIdentifier: identity.tokenIdentifier,
      email: identity.email,
      pictureUrl: identity.pictureUrl,
      firstName: identity.givenName,
      lastName: identity.familyName,
    };

    if (user !== null) {
      await user.patch({ ...userFields, deletionTime: undefined });
    } else {
      user = await ctx.table("users").insert(userFields).get();
    }

    return user;
  },
});

function emailUserName(email: string) {
  return email.split("@")[0];
}

export const foo = internalMutation({
  args: {},
  handler: async (ctx) => {
    await ctx.table("as", "b", (q) => q.eq("_creationTime" as any, 3 as any));
  },
});
