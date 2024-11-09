import { internalMutation } from "./functions";
import { getPermission, vPermission } from "./permissions";

export const init = internalMutation({
  args: {},
  handler: async (ctx) => {
    if ((await ctx.table("roles").first()) !== null) {
      throw new Error("There's an existing roles setup already.");
    }

    await ctx
      .table("permissions")
      .insertMany(vPermission.members.map((p) => ({ name: p.value })));

    await ctx.table("roles").insert({
      name: "Admin",
      isDefault: false,
      permissions: await Promise.all(
        vPermission.members.map(async (p) => getPermission(ctx, p.value)),
      ),
    });

    await ctx.table("roles").insert({
      name: "Member",
      isDefault: true,
      permissions: [
        await getPermission(ctx, "Read Members"),
        await getPermission(ctx, "Participate"),
      ],
    });
  },
});
