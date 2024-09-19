import { v } from "convex/values";

import { mutation, query } from "./functions";
import { createMember } from "./members";
import { getRole, viewerHasPermissionX } from "./permissions";
import { Ent, QueryCtx } from "./types";

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
        const sessions = await getChatSessions(ctx, chat);
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

type ValidSession<T> = NonNullable<T> & {
  publicKey: string;
};

async function getChatSessions(ctx: QueryCtx, chat: Ent<"chats">) {
  const chatMembers = await chat.edge("members");
  const chatUsers = (
    await Promise.all(chatMembers.map((m) => m.edge("user")))
  ).flat();
  const userSessions = await ctx
    .table("authSessions")
    .filter((q) =>
      q.or(...chatUsers.map(({ _id }) => q.eq(q.field("userId"), _id))),
    );
  const sessions = userSessions
    .filter((session): session is ValidSession<typeof session> => {
      return !!session && !!session.publicKey;
    })
    .map((session) => ({
      _id: session._id,
      publicKey: session.publicKey,
    }));
  return sessions;
}
