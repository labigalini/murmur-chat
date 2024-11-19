import { Id } from "./_generated/dataModel";
import { mutation } from "./functions";
import { QueryCtx } from "./types";

export const getUrl = async (
  ctx: QueryCtx,
  storageId: Id<"_storage"> | string,
) => {
  return (await ctx.storage.getUrl(storageId as Id<"_storage">)) ?? undefined;
};

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});
