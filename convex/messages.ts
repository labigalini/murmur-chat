import { getAuthSessionId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
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
      internal.messages.remove,
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

export const remove = internalMutation({
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

export const scheduleRemoval = internalMutation({
  handler: async (ctx) => {
    const now = Date.now();
    const chats = (await ctx.table("chats")).map((chat) => ({
      ...chat,
      threshold: now - chat.messageLifespan,
    }));

    const messageDelayGroups = new Map<number, Id<"messages">[]>();

    await Promise.all(
      chats.map(async (chat) => {
        // Get messages for this chat that are within the expiration window
        const messages = await ctx
          .table("messages")
          .filter((q) =>
            q.and(
              q.eq(q.field("chatId"), chat._id),
              q.lt(q.field("_creationTime"), chat.threshold),
            ),
          );
        if (messages.length) console.log({ messages });

        // Group messages by seconds until expiration
        messages.forEach((message) => {
          const secondsUntilExpiration = Math.max(
            1,
            Math.ceil(
              (message._creationTime + chat.messageLifespan - now) / 1000,
            ),
          );
          const existingGroup =
            messageDelayGroups.get(secondsUntilExpiration) ?? [];
          messageDelayGroups.set(secondsUntilExpiration, [
            ...existingGroup,
            message._id,
          ]);
        });
      }),
    );

    console.log({ messageDelayGroups });

    // Schedule deletion for each group of messages
    await Promise.all(
      Array.from(messageDelayGroups.entries()).map(([delay, messageIds]) =>
        ctx.scheduler.runAfter(delay * 1000, internal.messages.remove, {
          messageIds,
        }),
      ),
    );
  },
});
