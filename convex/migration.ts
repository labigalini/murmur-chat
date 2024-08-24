import { internalMutation } from "./functions";
import { getPermission } from "./permissions";

export const init = internalMutation({
  args: {},
  handler: async (ctx) => {
    if ((await ctx.table("roles").first()) !== null) {
      throw new Error("There's an existing roles setup already.");
    }
    await ctx
      .table("permissions")
      .insertMany([
        { name: "Manage Chat" },
        { name: "Delete Chat" },
        { name: "Manage Members" },
        { name: "Read Members" },
        { name: "Contribute" },
      ]);

    await ctx.table("roles").insert({
      name: "Admin",
      isDefault: false,
      permissions: [
        await getPermission(ctx, "Manage Chat"),
        await getPermission(ctx, "Delete Chat"),
        await getPermission(ctx, "Manage Members"),
        await getPermission(ctx, "Read Members"),
        await getPermission(ctx, "Contribute"),
      ],
    });
    await ctx.table("roles").insert({
      name: "Member",
      isDefault: true,
      permissions: [
        await getPermission(ctx, "Read Members"),
        await getPermission(ctx, "Contribute"),
      ],
    });
  },
});
