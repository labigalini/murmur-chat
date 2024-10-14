import { ConvexError, v } from "convex/values";

import { Id } from "./_generated/dataModel";
import { mutation, query } from "./functions";
import { viewerHasPermission, viewerHasPermissionX } from "./permissions";
import { getRole } from "./roles";
import { Ent, MutationCtx, QueryCtx } from "./types";
import { getUserSessions, getUsername } from "./users";
import { normalizeStringForSearch } from "./utils";

export const viewerPermissions = query({
  args: {
    chatId: v.optional(v.id("chats")),
  },
  async handler(ctx, { chatId }) {
    if (chatId === undefined || ctx.viewer === null) {
      return null;
    }
    return await ctx
      .table("members", "chatUser", (q) =>
        q.eq("chatId", chatId).eq("userId", ctx.viewerX()._id),
      )
      .uniqueX()
      .edge("role")
      .edge("permissions")
      .map((permission) => permission.name);
  },
});

export const list = query({
  args: {
    chatId: v.id("chats"),
    search: v.optional(v.string()),
  },
  async handler(ctx, { chatId, search }) {
    const viewMembers = await viewerHasPermission(ctx, chatId, "Read Members");
    if (ctx.viewer === null || !viewMembers) {
      return [];
    }
    const query = search
      ? ctx
          .table("members")
          .search("searchable", (q) =>
            q
              .search("searchable", normalizeStringForSearch(search))
              .eq("chatId", chatId),
          )
      : ctx.table("chats").getX(chatId).edge("members");
    return await query.map(async (member) => {
      const user = await member.edge("user");
      const sessions = await getUserSessions(ctx, user);
      const username = getUsername(user);
      return {
        _id: member._id,
        name: username,
        email: user.email,
        image: user.image,
        role: (await member.edge("role")).name,
        // permissions: (await member.edge("role")).edge("permissions"), This seems to break convex...
        sessions,
      };
    });
  },
});

export const update = mutation({
  args: {
    memberId: v.id("members"),
    roleId: v.id("roles"),
  },
  async handler(ctx, { memberId, roleId }) {
    const member = await ctx.table("members").getX(memberId);
    await viewerHasPermissionX(ctx, member.chatId, "Manage Members");
    await checkAnotherAdminExists(ctx, member);
    await member.patch({ roleId });
  },
});

export const deleteMember = mutation({
  args: {
    memberId: v.id("members"),
  },
  async handler(ctx, { memberId }) {
    const member = await ctx.table("members").getX(memberId);
    await viewerHasPermissionX(ctx, member.chatId, "Manage Members");
    await checkAnotherAdminExists(ctx, member);
    await ctx.table("members").getX(memberId).delete();
  },
});

async function checkAnotherAdminExists(ctx: QueryCtx, member: Ent<"members">) {
  const adminRole = await getRole(ctx, "Admin");
  const otherAdmin = await ctx
    .table("chats")
    .getX(member.chatId)
    .edge("members")
    .filter((q) =>
      q.and(
        q.eq(q.field("roleId"), adminRole._id),
        q.neq(q.field("_id"), member._id),
      ),
    )
    .first();
  if (otherAdmin === null) {
    throw new ConvexError("There must be at least one admin left on the chat");
  }
}

export async function createMember(
  ctx: MutationCtx,
  {
    chatId,
    roleId,
    user,
  }: { chatId: Id<"chats">; roleId: Id<"roles">; user: Ent<"users"> },
) {
  return await ctx.table("members").insert({
    chatId,
    userId: user._id,
    roleId,
    searchable: normalizeStringForSearch(`${user.name} ${user.email}`),
  });
}
