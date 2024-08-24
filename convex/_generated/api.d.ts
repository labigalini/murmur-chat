/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * Generated by convex@1.13.2.
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth_invites from "../auth/invites.js";
import type * as auth_members from "../auth/members.js";
import type * as auth_roles from "../auth/roles.js";
import type * as auth_teams from "../auth/teams.js";
import type * as auth_users from "../auth/users.js";
import type * as functions from "../functions.js";
import type * as migration_init from "../migration/init.js";
import type * as permissions from "../permissions.js";
import type * as team_inviteEmail from "../team/inviteEmail.js";
import type * as team_invites from "../team/invites.js";
import type * as team_messages from "../team/messages.js";
import type * as types from "../types.js";
import type * as utils from "../utils.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "auth/invites": typeof auth_invites;
  "auth/members": typeof auth_members;
  "auth/roles": typeof auth_roles;
  "auth/teams": typeof auth_teams;
  "auth/users": typeof auth_users;
  functions: typeof functions;
  "migration/init": typeof migration_init;
  permissions: typeof permissions;
  "team/inviteEmail": typeof team_inviteEmail;
  "team/invites": typeof team_invites;
  "team/messages": typeof team_messages;
  types: typeof types;
  utils: typeof utils;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
