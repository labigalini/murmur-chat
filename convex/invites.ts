import { ConvexError, v } from "convex/values";

import { Resend } from "resend";

import { InviteEmail } from "./InviteEmail";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { action } from "./_generated/server";
import { internalMutation, internalQuery, mutation, query } from "./functions";
import { createMember } from "./members";
import { viewerHasPermission, viewerHasPermissionX } from "./permissions";
import { Ent, QueryCtx } from "./types";
import { getUsername } from "./users";
import { getX } from "./utils";

// Temporary internal function to only allow invited users to signup
export const hasInvite = internalQuery({
  args: {
    email: v.string(),
  },
  async handler(ctx, { email }) {
    const invites = await ctx
      .table("invites", "email", (q) => q.eq("email", email))
      .first();
    return !!invites;
  },
});

export const list = query({
  async handler(ctx) {
    if (ctx.viewer === null) {
      return [];
    }

    const email = ctx.viewerX().email;
    if (email == null) {
      return [];
    }
    return await ctx
      .table("invites", "email", (q) => q.eq("email", email))
      .filter((q) => q.neq(q.field("revoked"), true))
      .map(async (invite) => ({
        _id: invite._id,
        email: invite.email,
        inviter: getUsername(await invite.edge("user")),
        chat: (await invite.edge("chat")).name,
        role: (await invite.edge("role")).name,
      }));
  },
});

export const listByChat = query({
  args: {
    chatId: v.id("chats"),
  },
  async handler(ctx, { chatId }) {
    if (ctx.viewer === null) {
      return [];
    }
    const viewMembers = await viewerHasPermission(ctx, chatId, "Read Members");
    if (!viewMembers) {
      return [];
    }
    return await ctx
      .table("invites", "chatId", (q) => q.eq("chatId", chatId))
      .filter((q) => q.neq(q.field("revoked"), true))
      .map(async (invite) => ({
        _id: invite._id,
        email: invite.email,
        inviter: getUsername(await invite.edge("user")),
        chat: (await invite.edge("chat")).name,
        role: (await invite.edge("role")).name,
      }));
  },
});

export const get = query({
  args: {
    inviteId: v.id("invites"),
  },
  async handler(ctx, { inviteId }) {
    if (ctx.viewer === null) {
      return null;
    }
    const invite = await ctx.table("invites").getX(inviteId);
    checkViewerWasInvitedX(ctx, invite);
    const user = await invite.edge("user");
    return {
      _id: invite._id,
      email: invite.email,
      inviter: getUsername(user),
      chat: (await invite.edge("chat")).name,
      role: (await invite.edge("role")).name,
    };
  },
});

export const accept = mutation({
  args: {
    inviteId: v.id("invites"),
  },
  async handler(ctx, { inviteId }) {
    const invite = await ctx.table("invites").getX(inviteId);
    checkViewerWasInvitedX(ctx, invite);
    const existingMember = await ctx
      .table("members", "chatUser", (q) =>
        q.eq("chatId", invite.chatId).eq("userId", ctx.viewerX()._id),
      )
      .unique();
    if (existingMember !== null) {
      await existingMember.patch({
        roleId: invite.roleId,
      });
    } else {
      await createMember(ctx, {
        chatId: invite.chatId,
        roleId: invite.roleId,
        user: ctx.viewerX(),
      });
    }
    await invite.delete();
    return (await invite.edge("chat"))._id;
  },
});

export const revoke = mutation({
  args: {
    inviteId: v.id("invites"),
  },
  async handler(ctx, { inviteId }) {
    await ctx.table("invites").getX(inviteId).patch({ revoked: true });
  },
});

export const remove = internalMutation({
  args: {
    inviteId: v.id("invites"),
  },
  async handler(ctx, { inviteId }) {
    const invite = await ctx.table("invites").getX(inviteId);
    checkViewerWasInvitedX(ctx, invite);
    await invite.delete();
  },
});

// NOTE: If you want your users to accept invites after signing up
// with a different email, add a cryptographically secure token to
// the invite ent, and use it in place of the ID as INVITE_PARAM.
// Don't use the invite ID, as it shown to all team members.
function checkViewerWasInvitedX(ctx: QueryCtx, invite: Ent<"invites">) {
  if (invite.email !== ctx.viewerX().email) {
    throw new Error("Invite email does not match viewer email");
  }
}

// To enable sending emails, set
// - `RESEND_API_KEY`
// - `SITE_URL` to the URL where your site is hosted
// on your Convex dashboard:
// https://dashboard.convex.dev/deployment/settings/environment-variables
// To test emails, override the email address by setting
// `OVERRIDE_INVITE_EMAIL`.
export const send = action({
  args: {
    chatId: v.id("chats"),
    email: v.string(),
    roleId: v.optional(v.id("roles")),
  },
  async handler(ctx, { chatId, email, roleId: initialRoleId }) {
    const { inviterUserId, inviterEmail, chatName } = await ctx.runMutation(
      internal.invites.prepare,
      { chatId },
    );
    const roleId =
      initialRoleId ?? (await ctx.runQuery(internal.roles.get, {}))._id;
    const inviteId = await ctx.runMutation(internal.invites.create, {
      chatId,
      email,
      roleId,
      inviterUserId,
    });
    try {
      await sendInviteEmail({ email, inviteId, inviterEmail, chatName });
    } catch (error) {
      await ctx.runMutation(internal.invites.remove, {
        inviteId,
      });
      throw error;
    }
  },
});

export const prepare = internalMutation({
  args: {
    chatId: v.id("chats"),
  },
  async handler(ctx, { chatId }) {
    await viewerHasPermissionX(ctx, chatId, "Manage Members");
    const inviter = ctx.viewerX();
    return {
      inviterUserId: inviter._id,
      inviterEmail: getX(inviter.email),
      chatName: (await ctx.table("chats").getX(chatId)).name,
    };
  },
});

export const create = internalMutation({
  args: {
    chatId: v.id("chats"),
    email: v.string(),
    roleId: v.id("roles"),
    inviterUserId: v.id("users"),
  },
  async handler(ctx, { chatId, email, roleId, inviterUserId }) {
    return await ctx.table("invites").insert({
      chatId,
      email,
      roleId,
      inviterUserId,
    });
  },
});

async function sendInviteEmail({
  email,
  inviteId,
  inviterEmail,
  chatName,
}: {
  email: string;
  inviteId: Id<"invites">;
  inviterEmail: string;
  chatName: string;
}) {
  if (
    process.env.RESEND_API_KEY === undefined ||
    process.env.SITE_URL === undefined
  ) {
    console.error(
      "Set up `RESEND_API_KEY` and `SITE_URL` to send invite emails",
    );
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send(
    InviteEmail({ inviteId, inviterEmail, chatName, email }),
  );

  if (error) {
    throw new ConvexError("Could not send invitation email");
  }
}
