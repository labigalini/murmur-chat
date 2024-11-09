import { Infer, v } from "convex/values";

import { Id } from "./_generated/dataModel";
import { MutationCtx, QueryCtx } from "./types";

export const vPermission = v.union(
  v.literal("Manage Chat"),
  v.literal("Delete Chat"),
  v.literal("Read Members"),
  v.literal("Manage Members"),
  v.literal("Participate"),
);
export type Permission = Infer<typeof vPermission>;

export async function getPermission(ctx: QueryCtx, name: Permission) {
  return (await ctx.table("permissions").getX("name", name))._id;
}

export async function viewerWithPermission(
  ctx: QueryCtx,
  chatId: Id<"chats">,
  name: Permission,
) {
  const member = await ctx
    .table("members", "chatUser", (q) =>
      q.eq("chatId", chatId).eq("userId", ctx.viewerX()._id),
    )
    .unique();
  if (
    member === null ||
    !(await member
      .edge("role")
      .edge("permissions")
      .has(await getPermission(ctx, name)))
  ) {
    return null;
  }
  return member;
}

export async function viewerHasPermission(
  ctx: QueryCtx,
  chatId: Id<"chats">,
  name: Permission,
) {
  const member = await viewerWithPermission(ctx, chatId, name);
  return member !== null;
}

export async function viewerWithPermissionX(
  ctx: MutationCtx,
  chatId: Id<"chats">,
  name: Permission,
) {
  const member = await viewerWithPermission(ctx, chatId, name);
  if (member === null) {
    throw new Error(`Viewer does not have the permission "${name}"`);
  }
  return member;
}

export async function viewerHasPermissionX(
  ctx: MutationCtx,
  chatId: Id<"chats">,
  name: Permission,
) {
  await viewerWithPermissionX(ctx, chatId, name);
  return true;
}
