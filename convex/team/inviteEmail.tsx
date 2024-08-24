import { INVITE_PARAM } from "../../app/constants";
import { Id } from "../_generated/dataModel";

export const InviteEmail = ({
  inviteId,
  inviterEmail,
  teamName,
  email,
}: {
  email: string;
  inviteId: Id<"invites">;
  inviterEmail: string;
  teamName: string;
}) => ({
  from: "My App <onboarding@resend.dev>",
  to: [process.env.OVERRIDE_INVITE_EMAIL ?? email],
  subject: `${inviterEmail} invited you to join them in My App`,
  react: (
    <div>
      <strong>{inviterEmail}</strong> invited you to join team{" "}
      <strong>{teamName}</strong> in My App. Click{" "}
      <a href={`${process.env.HOSTED_URL}/t?${INVITE_PARAM}=${inviteId}`}>
        here to accept
      </a>{" "}
      or log in to My App.
    </div>
  ),
});
