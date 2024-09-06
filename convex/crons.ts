import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.cron(
  "destruct all expired messages",
  "*/5 * * * *",
  internal.messages.destructAllExpired,
  {},
);

export default crons;
