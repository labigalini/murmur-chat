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

const mapInviteResponse = async (invite: Ent<"invites">) => {
  const inviterUser = await invite.edge("user");
  const inviterMember = await inviterUser
    .edge("members")
    .filter((q) => q.eq(q.field("chatId"), invite.chatId))
    .first();
  return {
    _id: invite._id,
    email: invite.email,
    inviter: inviterMember?.name ?? inviterUser.name,
    chat: (await invite.edge("chat")).name,
    role: (await invite.edge("role")).name,
  };
};

export const list = query({
  async handler(ctx) {
    const email = ctx.viewer?.email;
    if (email == null) {
      return [];
    }
    return await ctx
      .table("invites", "email", (q) => q.eq("email", email))
      .filter((q) => q.neq(q.field("revoked"), true))
      .map(mapInviteResponse);
  },
});

export const listByChat = query({
  args: {
    chatId: v.id("chats"),
  },
  async handler(ctx, { chatId }) {
    if (!(await viewerHasPermission(ctx, chatId, "Invite Members"))) {
      return [];
    }
    return await ctx
      .table("invites", "chatId", (q) => q.eq("chatId", chatId))
      .filter((q) => q.neq(q.field("revoked"), true))
      .map(mapInviteResponse);
  },
});

export const get = query({
  args: {
    inviteId: v.id("invites"),
  },
  async handler(ctx, { inviteId }) {
    const invite = await ctx.table("invites").getX(inviteId);
    checkViewerWasInvitedX(ctx, invite);
    return mapInviteResponse(invite);
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
    const invite = await ctx.table("invites").getX(inviteId);
    await viewerHasPermissionX(ctx, invite.chatId, "Manage Members");
    await invite.patch({ revoked: true });
  },
});

export const remove = internalMutation({
  args: {
    inviteId: v.id("invites"),
  },
  async handler(ctx, { inviteId }) {
    await ctx.table("invites").getX(inviteId).delete();
  },
});

function checkViewerWasInvitedX(ctx: QueryCtx, invite: Ent<"invites">) {
  if (invite.email !== ctx.viewerX().email) {
    throw new Error("Invite email does not match viewer email");
  }
}

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
      await ctx.runMutation(internal.invites.remove, { inviteId });
      throw error;
    }
  },
});

export const prepare = internalMutation({
  args: {
    chatId: v.id("chats"),
  },
  async handler(ctx, { chatId }) {
    await viewerHasPermissionX(ctx, chatId, "Invite Members");
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
    await viewerHasPermissionX(ctx, chatId, "Invite Members");
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
