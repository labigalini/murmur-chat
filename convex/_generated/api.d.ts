/* eslint-disable */

/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */
import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

import type * as auth from "../auth.js";
import type * as auth_ResendOTP from "../auth/ResendOTP.js";
import type * as chats from "../chats.js";
import type * as crons from "../crons.js";
import type * as functions from "../functions.js";
import type * as http from "../http.js";
import type * as invites from "../invites.js";
import type * as members from "../members.js";
import type * as messages from "../messages.js";
import type * as migration from "../migration.js";
import type * as permissions from "../permissions.js";
import type * as types from "../types.js";
import type * as users from "../users.js";
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
  "auth/ResendOTP": typeof auth_ResendOTP;
  auth: typeof auth;
  chats: typeof chats;
  crons: typeof crons;
  functions: typeof functions;
  http: typeof http;
  invites: typeof invites;
  members: typeof members;
  messages: typeof messages;
  migration: typeof migration;
  permissions: typeof permissions;
  types: typeof types;
  users: typeof users;
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
