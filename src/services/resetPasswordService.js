import SignUp from "../models/signupModels.js";
import PasswordReset from "../models/passwordResetModel.js";

import { hashPassword, comparePassword } from "../common/passwordUtils.js";
import { HttpError } from "../common/httpError.js";

export const MAX_OTP_ATTEMPTS = 5;

const MIN_PASSWORD_LENGTH = 8;
// bcrypt only uses the first 72 bytes, so longer passwords would be silently truncated.
const MAX_PASSWORD_LENGTH = 72;

export const resetPasswordService = async (data) => {
  const email =
    typeof data?.email === "string" ? data.email.toLowerCase().trim() : "";
  const otp = typeof data?.otp === "string" ? data.otp.trim() : "";
  const newPassword = data?.newPassword;

  if (!email || !otp || !newPassword) {
    throw new HttpError(400, "Email, OTP and new password are required");
  }

  if (
    typeof newPassword !== "string" ||
    newPassword.length < MIN_PASSWORD_LENGTH ||
    newPassword.length > MAX_PASSWORD_LENGTH
  ) {
    throw new HttpError(
      400,
      `Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters`,
    );
  }

  // One message for every failure (unknown email, no OTP, expired, locked,
  // wrong OTP) so nothing leaks about which emails exist.
  const invalidOtp = () => new HttpError(400, "Invalid or expired OTP");

  const user = await SignUp.findOne({ email });

  if (!user) {
    throw invalidOtp();
  }

  // Atomically use up one attempt *before* checking the OTP. Doing it in one
  // query means parallel requests can't sneak past the attempt limit.
  const resetRecord = await PasswordReset.findOneAndUpdate(
    {
      userId: user._id,
      expiresAt: { $gt: new Date() },
      attempts: { $lt: MAX_OTP_ATTEMPTS },
    },
    { $inc: { attempts: 1 } },
    { new: true },
  );

  if (!resetRecord) {
    throw invalidOtp();
  }

  const isMatch = await comparePassword(otp, resetRecord.otpHash);

  if (!isMatch) {
    throw invalidOtp();
  }

  user.password = await hashPassword(newPassword);
  // Receiving the OTP proves the person controls this mailbox.
  user.isEmailVerified = true;
  await user.save();

  // OTP is single-use.
  await PasswordReset.deleteMany({ userId: user._id });

  return { message: "Password reset successful. You can now log in." };
};
