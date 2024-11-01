import { getAuthSessionId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { subMinutes } from "date-fns";

import { internal } from "./_generated/api";
import { internalMutation, mutation, query } from "./functions";
import { viewerHasPermission, viewerWithPermissionX } from "./permissions";

export const unreadCount = query({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, { chatId }) => {
    const viewer = ctx.viewer;
    const sessionId = await getAuthSessionId(ctx);
    if (
      viewer === null ||
      sessionId === null ||
      !(await viewerHasPermission(ctx, chatId, "Contribute"))
    ) {
      return 0;
    }
    return (
      await ctx
        .table("messages", "recipient", (q) =>
          q.eq("chatId", chatId).eq("recipientSessionId", sessionId),
        )
        .filter((q) => q.eq(q.field("readTime"), undefined))
    ).length;
  },
});

export const list = query({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, { chatId }) => {
    const viewer = ctx.viewer;
    const sessionId = await getAuthSessionId(ctx);
    if (
      viewer === null ||
      sessionId === null ||
      !(await viewerHasPermission(ctx, chatId, "Contribute"))
    ) {
      return [];
    }
    const chat = await ctx.table("chats").getX(chatId);
    return await ctx
      .table("messages", "recipient", (q) =>
        q.eq("chatId", chatId).eq("recipientSessionId", sessionId),
      )
      .order("desc")
      .map(async (message) => {
        const member = await message.edge("member");
        const user = await member.edge("user");
        return {
          _id: message._id,
          _creationTime: message._creationTime,
          _expirationTime: message._creationTime + chat.messageLifespan,
          text: message.text,
          author: {
            _id: user._id,
            name: user.name ?? user.email!,
            image: user.image,
          },
          isViewer: user._id === viewer._id,
          readTime: message.readTime,
        };
      });
  },
});

export const create = mutation({
  args: {
    chatId: v.id("chats"),
    messages: v.array(
      v.object({ text: v.string(), recipientSessionId: v.id("authSessions") }),
    ),
  },
  handler: async (ctx, { chatId, messages }) => {
    const member = await viewerWithPermissionX(ctx, chatId, "Contribute");
    const messageIds = await ctx.table("messages").insertMany(
      messages.map(({ text, recipientSessionId }) => ({
        text,
        chatId,
        memberId: member._id,
        recipientSessionId,
      })),
    );
    const chat = await ctx.table("chats").getX(chatId);
    await ctx
      .table("chats")
      .getX(chatId)
      .patch({ lastActivityTime: Date.now() });
    await ctx.scheduler.runAfter(
      chat.messageLifespan,
      internal.messages.destruct,
      { messageIds },
    );
  },
});

export const markRead = mutation({
  args: {
    messageIds: v.array(v.id("messages")),
  },
  handler: async (ctx, { messageIds }) =>
    Promise.all(
      messageIds.map(
        async (messageId) =>
          await ctx
            .table("messages")
            .getX(messageId)
            .patch({ readTime: Date.now() }),
      ),
    ),
});

export const destruct = internalMutation({
  args: {
    messageIds: v.array(v.id("messages")),
  },
  handler: async (ctx, { messageIds }) => {
    await Promise.all(
      messageIds.map(async (messageId) => {
        const message = await ctx.table("messages").get(messageId);
        if (message) await message.delete();
      }),
    );
  },
});

export const destructAllExpired = internalMutation({
  handler: async (ctx) => {
    const fiveMinutesAgo = subMinutes(new Date(), 5); // TODO need to get the chat config
    const messages = await ctx
      .table("messages")
      .filter((q) => q.lt(q.field("_creationTime"), fiveMinutesAgo.getTime()));
    await Promise.all(messages.map(async (message) => await message.delete()));
    return messages.length;
  },
});
