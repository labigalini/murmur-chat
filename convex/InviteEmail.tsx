import { Id } from "@/convex/_generated/dataModel";

import { INVITE_PARAM, RESEND_DEV_EMAIL } from "@/lib/constants";

export const InviteEmail = ({
  inviteId,
  inviterEmail,
  chatName,
  email,
}: {
  email: string;
  inviteId: Id<"invites">;
  inviterEmail: string;
  chatName: string;
}) => ({
  from: process.env.AUTH_EMAIL ?? RESEND_DEV_EMAIL,
  to: process.env.DEV_EMAIL ?? email,
  subject: `${inviterEmail} invited you to join them in murmur.chat`,
  react: (
    <div>
      <strong>{inviterEmail}</strong> invited you to join team{" "}
      <strong>{chatName}</strong> in murmur.chat. Click{" "}
      <a href={`${process.env.SITE_URL}/?${INVITE_PARAM}=${inviteId}`}>
        here to accept
      </a>{" "}
      or log in to My App.
    </div>
  ),
});
