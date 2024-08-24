import { defineEnt, defineEntSchema, getEntDefinitions } from "convex-ents";
import { v } from "convex/values";
import { vPermission, vRole } from "./permissions";

// Example: 7 day soft deletion period for chats
const CHAT_DELETION_DELAY_MS = 7 * 24 * 60 * 60 * 1000;

const schema = defineEntSchema(
  {
    chats: defineEnt({
      name: v.string(),
    })
      .edges("messages", { ref: true })
      .edges("members", { ref: true })
      .edges("invites", { ref: true })
      .deletion("scheduled", { delayMs: CHAT_DELETION_DELAY_MS }),

    users: defineEnt({
      firstName: v.optional(v.string()),
      lastName: v.optional(v.string()),
      fullName: v.string(),
      pictureUrl: v.optional(v.string()),
    })
      .field("email", v.string(), { unique: true })
      .field("tokenIdentifier", v.string(), { unique: true })
      .edges("members", { ref: true, deletion: "soft" })
      .deletion("soft"),

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
      .edges("messages", { ref: true })
      .deletion("soft"),

    invites: defineEnt({
      inviterEmail: v.string(),
    })
      .field("email", v.string(), { unique: true })
      .edge("chat")
      .edge("role"),

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
    })
      .edge("chat")
      .edge("member"),

    as: defineEnt({ ["b"]: v.any() }).index("b", ["b"]),
  },
  { schemaValidation: false },
);

export default schema;

export const entDefinitions = getEntDefinitions(schema);
