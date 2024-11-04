export const INVITE_PARAM = "invite";
export const RESEND_DEV_EMAIL = "murmur.chat <onboarding@resend.dev>";
export const DEFAULT_MESSAGE_LIFESPAN = 5 * 60 * 1000; // 5 minutes
export const INACTIVE_TIMEOUT = 30 * 60 * 1000; // 30 minutes
export const PROTECTED_ROUTES = [
  "/((?!login).*)", // Match all routes except /login
];
