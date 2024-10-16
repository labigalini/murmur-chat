import { v } from "convex/values";

import { mutation, query } from "./functions";
import { createMember } from "./members";
import { viewerHasPermissionX } from "./permissions";
import { getRole } from "./roles";

export const list = query({
  args: {},
  async handler(ctx) {
    if (ctx.viewer === null) {
      return [];
    }
    return (
      await ctx.viewer.edge("members").map(async (member) => {
        const chat = await member.edge("chat");
        return {
          _id: chat._id,
          name: chat.name,
          image: chat.image,
          lastActivity: chat.lastActivityTime ?? chat._creationTime,
        };
      })
    ).sort((c1, c2) => c2.lastActivity - c1.lastActivity);
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

export const remove = mutation({
  args: {
    chatId: v.id("chats"),
  },
  async handler(ctx, { chatId }) {
    await viewerHasPermissionX(ctx, chatId, "Delete Chat");
    const chat = await ctx.table("chats").getX(chatId);
    await chat.delete();
  },
});
