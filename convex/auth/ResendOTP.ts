import { Email } from "@convex-dev/auth/providers/Email";

import { alphabet, generateRandomString } from "oslo/crypto";
import { Resend as ResendAPI } from "resend";

export const ResendOTP = Email({
  id: "resend-otp",
  apiKey: process.env.AUTH_RESEND_KEY,
  maxAge: 60 * 15, // 15 minutes
  generateVerificationToken() {
    return generateRandomString(8, alphabet("0-9"));
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    const resend = new ResendAPI(provider.apiKey);
    const toEmail = process.env.DEV_EMAIL ?? email;
    const { error } = await resend.emails.send({
      from: process.env.AUTH_EMAIL ?? "My App <onboarding@resend.dev>",
      to: process.env.DEV_EMAIL ?? email,
      subject: `Sign in to My App`,
      text: "Your code is " + token,
    });
    if (error) {
      console.error(error, toEmail);
      throw new Error(`Failed to send OTP email.`);
    }
  },
});
