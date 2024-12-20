import { v } from "convex/values";

import { DEFAULT_MESSAGE_LIFESPAN } from "@/lib/constants";

import { api } from "./_generated/api";
import { mutation, query } from "./functions";
import { createMember } from "./members";
import { viewerHasPermissionX } from "./permissions";
import { getRole } from "./roles";
import { getUrl } from "./storage";

export const list = query({
  args: {},
  async handler(ctx) {
    if (ctx.viewer === null) {
      return [];
    }
    return (
      await ctx.viewer.edge("members").map(async (member) => {
        const chat = await member.edge("chat");
        const unreadCount: number = await ctx.runQuery(
          api.messages.unreadCount,
          { chatId: chat._id },
        );
        return {
          _id: chat._id,
          name: chat.name,
          image: chat.image && (await getUrl(ctx, chat.image)),
          messageLifespan: chat.messageLifespan,
          unreadCount,
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
    const chatId = await ctx
      .table("chats")
      .insert({ name, messageLifespan: DEFAULT_MESSAGE_LIFESPAN });
    await createMember(ctx, {
      chatId,
      user: ctx.viewerX(),
      roleId: (await getRole(ctx, "Owner"))._id,
    });
    return chatId;
  },
});

export const patch = mutation({
  args: {
    chatId: v.id("chats"),
    messageLifespan: v.optional(v.number()),
    name: v.optional(v.string()),
    image: v.optional(v.id("_storage")),
  },
  async handler(ctx, { chatId, ...changes }) {
    await viewerHasPermissionX(ctx, chatId, "Manage Chat");
    const chat = await ctx.table("chats").getX(chatId);
    if (changes.image && chat.image) {
      await ctx.storage.delete(chat.image);
    }
    return chat.patch(changes);
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
