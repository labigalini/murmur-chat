import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./functions";
import {
  getRole,
  viewerHasPermission,
  viewerHasPermissionX,
} from "./permissions";
import { Ent, MutationCtx, QueryCtx } from "./types";
import { emptyPage, normalizeStringForSearch } from "./utils";

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
    search: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  async handler(ctx, { chatId, search, paginationOpts }) {
    if (
      ctx.viewer === null ||
      !(await viewerHasPermission(ctx, chatId, "Read Members"))
    ) {
      return emptyPage();
    }
    const query =
      search === ""
        ? ctx.table("chats").getX(chatId).edge("members")
        : ctx
            .table("members")
            .search("searchable", (q) =>
              q
                .search("searchable", normalizeStringForSearch(search))
                .eq("chatId", chatId),
            );
    return await query
      .filter((q) => q.eq(q.field("deletionTime"), undefined))
      .paginate(paginationOpts)
      .map(async (member) => {
        const user = await member.edge("user");
        return {
          _id: member._id,
          fullName: user.fullName,
          email: user.email,
          pictureUrl: user.pictureUrl,
          initials:
            user.firstName === undefined || user.lastName === undefined
              ? user.fullName[0]
              : user.firstName[0] + user.lastName[0],
          roleId: member.roleId,
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
        q.eq(q.field("deletionTime"), undefined),
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
    searchable: normalizeStringForSearch(`${user.fullName} ${user.email}`),
  });
}
