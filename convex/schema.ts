import { authTables } from "@convex-dev/auth/server";
import {
  defineEnt,
  defineEntFromTable,
  defineEntSchema,
  defineEntsFromTables,
  getEntDefinitions,
} from "convex-ents";
import { v } from "convex/values";

import { vPermission } from "./permissions";
import { vRole } from "./roles";

const schema = defineEntSchema(
  {
    ...defineEntsFromTables(authTables),

    authSessions: defineEntFromTable(authTables.authSessions) // override to add edges
      .edge("authSessionDetail"),

    authSessionDetails: defineEnt({
      publicKey: v.optional(v.string()),
      lastUsedTime: v.optional(v.number()),
    }).edge("authSession", { field: "sessionId" }),

    users: defineEntFromTable(authTables.users) // override to add edges
      .edges("members", { ref: true })
      .edges("invites", { ref: "inviterUserId" }),

    chats: defineEnt({
      name: v.string(),
      image: v.optional(v.string()),
      lastActivityTime: v.optional(v.number()),
      messageLifespan: v.number(),
    })
      .edges("messages", { ref: true })
      .edges("members", { ref: true })
      .edges("invites", { ref: true }),

    members: defineEnt({
      searchable: v.string(),
    })
      .edge("chat")
      .edge("user")
      .edge("role")
      .index("chatUser", ["chatId", "userId"])
      .searchIndex("searchable", {
        searchField: "searchable",
        filterFields: ["chatId"],
      })
      .edges("messages", { ref: true }),

    invites: defineEnt({})
      .field("email", v.string())
      .field("revoked", v.optional(v.boolean()))
      .edge("user", { field: "inviterUserId" })
      .edge("chat")
      .edge("role")
      .index("email", ["email"]),

    roles: defineEnt({
      isDefault: v.boolean(),
    })
      .field("name", vRole, { unique: true })
      .edges("permissions")
      .edges("members", { ref: true })
      .edges("invites", { ref: true }),

    permissions: defineEnt({})
      .field("name", vPermission, { unique: true })
      .edges("roles"),

    messages: defineEnt({
      text: v.string(),
      readTime: v.optional(v.number()),
      recipientSessionId: v.id("authSessions"),
    })
      .edge("chat")
      .edge("member")
      .index("recipient", ["chatId", "recipientSessionId"]),
  },
  { schemaValidation: false },
);

export default schema;

export const entDefinitions = getEntDefinitions(schema);
