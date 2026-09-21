import SignUp from "../models/signupModels.js";
import PasswordReset from "../models/passwordResetModel.js";

import { hashPassword } from "../common/passwordUtils.js";
import { generateOtp } from "../common/otpUtils.js";
import { sendPasswordResetOtpEmail } from "../common/emailUtils.js";
import { HttpError } from "../common/httpError.js";

export const OTP_EXPIRES_IN_MINUTES = 10;
export const RESEND_COOLDOWN_SECONDS = 60;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Same response whether or not the email exists, so this endpoint can't be
// used to find out which emails are registered.
const GENERIC_MESSAGE =
  "If an account exists for this email, a password reset OTP has been sent.";

export const forgotPasswordService = async (data) => {
  const email =
    typeof data?.email === "string" ? data.email.toLowerCase().trim() : "";

  if (!email || !EMAIL_REGEX.test(email)) {
    throw new HttpError(400, "A valid email is required");
  }

  const user = await SignUp.findOne({ email });

  if (user) {
    // Cooldown: ignore repeat requests so the endpoint can't be used to spam
    // someone's inbox. The earlier OTP is still valid.
    const recentRequest = await PasswordReset.findOne({
      userId: user._id,
      createdAt: {
        $gt: new Date(Date.now() - RESEND_COOLDOWN_SECONDS * 1000),
      },
    });

    if (!recentRequest) {
      const otp = generateOtp();

      // Only one active reset OTP per user.
      await PasswordReset.deleteMany({ userId: user._id });

      await PasswordReset.create({
        userId: user._id,
        otpHash: await hashPassword(otp),
        expiresAt: new Date(Date.now() + OTP_EXPIRES_IN_MINUTES * 60 * 1000),
      });

      // Not awaited: keeps response time the same for existing and
      // non-existing emails. A mail failure is logged, not surfaced.
      sendPasswordResetOtpEmail(
        user.email,
        otp,
        OTP_EXPIRES_IN_MINUTES,
      ).catch((error) => {
        console.error("Failed to send password reset email:", error);
      });
    }
  }

  return { message: GENERIC_MESSAGE };
};
