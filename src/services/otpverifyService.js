import SignUp from "../models/signupModels.js";
import EmailOtp from "../models/emailotpModel.js";

export const verifyOtpService = async (data) => {
  const { userId, otp } = data;

  if (!userId || !otp) {
    throw new Error("User ID and OTP are required");
  }

  const user = await SignUp.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.isEmailVerified) {
    throw new Error("Email is already verified");
  }

  const otpRecord = await EmailOtp.findOne({
    userId,
    otp,
  });

  if (!otpRecord) {
    throw new Error("Invalid OTP");
  }

  if (new Date() > otpRecord.expiresAt) {
    await EmailOtp.deleteOne({
      _id: otpRecord._id,
    });

    throw new Error("OTP has expired");
  }

  user.isEmailVerified = true;

  await user.save();

  await EmailOtp.deleteOne({
    _id: otpRecord._id,
  });

  return {
    message: "Email verified successfully",
  };
};