import { cronJobs } from "convex/server";

import { internal } from "./_generated/api";

const crons = cronJobs();

crons.cron(
  "remove expired messages",
  "* * * * *",
  internal.messages.scheduleRemoval,
  {},
);

// crons.cron(
//   "remove expired sessions",
//   "0 * * * *",
//   internal.auth.removeExpired,
//   {},
// );

export default crons;
