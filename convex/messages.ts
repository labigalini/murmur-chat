import { v } from "convex/values";
import { subMinutes } from "date-fns";
import { internal } from "./_generated/api";
import { internalMutation, mutation, query } from "./functions";
import { viewerHasPermission, viewerWithPermissionX } from "./permissions";

export const MESSAGE_EXPIRATION_MINUTES = parseFloat(
  process.env.MESSAGE_EXPIRATION_MINUTES ?? "5",
);
export const MESSAGE_EXPIRATION_MILLISECONDS =
  MESSAGE_EXPIRATION_MINUTES * 60 * 1000;

export const list = query({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, { chatId }) => {
    const viewer = ctx.viewer;
    if (
      viewer === null ||
      !(await viewerHasPermission(ctx, chatId, "Contribute"))
    ) {
      return [];
    }
    return await ctx
      .table("chats")
      .getX(chatId)
      .edge("messages")
      .order("asc")
      .map(async (message) => {
        const member = await message.edge("member");
        const user = await member.edge("user");
        return {
          _id: message._id,
          _creationTime: message._creationTime,
          text: message.text,
          author: {
            _id: user._id,
            name: user.name ?? user.email!,
            image: user.image,
          },
          isViewer: user._id === viewer._id,
        };
      });
  },
});

export const create = mutation({
  args: {
    chatId: v.id("chats"),
    text: v.string(),
  },
  handler: async (ctx, { chatId, text }) => {
    const member = await viewerWithPermissionX(ctx, chatId, "Contribute");
    if (text.trim().length === 0) {
      throw new Error("Message must not be empty");
    }
    const messageId = await ctx.table("messages").insert({
      text,
      chatId: chatId,
      memberId: member._id,
    });
    await ctx.scheduler.runAfter(
      MESSAGE_EXPIRATION_MILLISECONDS,
      internal.messages.destruct,
      { messageId },
    );
  },
});

export const destruct = internalMutation({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, { messageId }) => {
    const message = await ctx.table("messages").getX(messageId);
    await message.delete();
  },
});

export const destructAllExpired = internalMutation({
  handler: async (ctx) => {
    const fiveMinutesAgo = subMinutes(new Date(), MESSAGE_EXPIRATION_MINUTES);
    const messages = await ctx
      .table("messages")
      .filter((q) => q.lt(q.field("_creationTime"), fiveMinutesAgo.getTime()));
    await Promise.all(messages.map(async (message) => await message.delete()));
    return messages.length;
  },
});
