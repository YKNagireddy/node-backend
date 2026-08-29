import SignUp from "../models/signupModels.js";
import EmailOtp from "../models/emailotpModel.js";

import { generateOtp } from "../common/otpUtils.js";
import { sendOtpEmail } from "../common/emailUtils.js";

export const resendOtpService = async (data) => {
  const { userId } = data;

  if (!userId) {
    throw new Error("User ID is required");
  }

  const user = await SignUp.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.isEmailVerified) {
    throw new Error("Email is already verified");
  }

  const otp = generateOtp();

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await EmailOtp.deleteMany({
    userId: user._id,
  });

  await EmailOtp.create({
    userId: user._id,
    otp,
    expiresAt,
  });

  await sendOtpEmail(user.email, otp);

  return {
    message: "New OTP sent successfully",
  };
};