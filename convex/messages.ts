import { v } from "convex/values";
import { mutation, query } from "./functions";
import { viewerHasPermission, viewerWithPermissionX } from "./permissions";

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
    await ctx.table("messages").insert({
      text,
      chatId: chatId,
      memberId: member._id,
    });
  },
});
