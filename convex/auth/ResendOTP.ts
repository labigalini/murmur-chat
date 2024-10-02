import { Email } from "@convex-dev/auth/providers/Email";

import { alphabet, generateRandomString } from "oslo/crypto";
import { Resend as ResendAPI } from "resend";

import { RESEND_DEV_EMAIL } from "@/lib/constants";

export const ResendOTP = Email({
  id: "resend-otp",
  apiKey: process.env.RESEND_API_KEY,
  maxAge: 60 * 15, // 15 minutes
  generateVerificationToken() {
    return generateRandomString(8, alphabet("0-9"));
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    const resend = new ResendAPI(provider.apiKey);
    const toEmail = process.env.DEV_EMAIL ?? email;
    const { error } = await resend.emails.send({
      from: process.env.AUTH_EMAIL ?? RESEND_DEV_EMAIL,
      to: process.env.DEV_EMAIL ?? email,
      subject: `Sign in to murmur.chat`,
      text: "Your code is " + token,
    });
    if (error) {
      console.error(error, toEmail);
      throw new Error(`Failed to send OTP email.`);
    }
  },
});
