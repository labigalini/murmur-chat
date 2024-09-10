import { v } from "convex/values";

import { mutation, query } from "./functions";
import { createMember } from "./members";
import { getRole, viewerHasPermissionX } from "./permissions";

export const list = query({
  args: {},
  async handler(ctx) {
    if (ctx.viewer === null) {
      return [];
    }
    return await ctx.viewer
      .edge("members")
      .order("desc")
      .map(async (member) => {
        const chat = await member.edge("chat");
        const sessions = (
          await Promise.all(
            (await chat.edge("members")).map((m) =>
              m.edge("user").edge("authSessions"),
            ), // TODO filter by expiration time
          )
        )
          .flat()
          .filter((session) => !!session.publicKey)
          .map((session) => ({
            _id: session._id,
            publicKey: session.publicKey!,
          }));
        return {
          _id: chat._id,
          name: chat.name,
          image: chat.image,
          sessions,
        };
      });
  },
});

export const create = mutation({
  args: {
    name: v.string(),
  },
  async handler(ctx, { name }) {
    const chatId = await ctx.table("chats").insert({ name });
    await createMember(ctx, {
      chatId,
      user: ctx.viewerX(),
      roleId: (await getRole(ctx, "Admin"))._id,
    });
    return chatId;
  },
});

export const deleteChat = mutation({
  args: {
    chatId: v.id("chats"),
  },
  async handler(ctx, { chatId }) {
    await viewerHasPermissionX(ctx, chatId, "Delete Chat");
    const chat = await ctx.table("chats").getX(chatId);
    await chat.delete();
  },
});
