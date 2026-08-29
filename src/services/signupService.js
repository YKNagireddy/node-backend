import SignUp from "../models/signupModels.js";
import EmailOtp from "../models/emailotpModel.js";

import { hashPassword, comparePassword } from "../common/passwordUtils.js";
import { generateOtp } from "../common/otpUtils.js";
import { sendOtpEmail } from "../common/emailUtils.js";

export const signupService = async (data) => {
  const {
    name,
    email,
    password,
    mobilenumber,
    businessName,
    businessGst,
  } = data;

  if (!name || !email || !password || !mobilenumber) {
    throw new Error(
      "Name, email, password and mobile number are required",
    );
  }

  const existingUser = await SignUp.findOne({ email });

  if (existingUser) {
    throw new Error("Email already registered");
  }
  const hashedPassword = await hashPassword(password);
  const user = await SignUp.create({
    name,
    email,
    password: hashedPassword,
    mobilenumber,
    businessName,
    businessGst,
  });

  const otp = generateOtp();

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await EmailOtp.create({
    userId: user._id,
    otp,
    expiresAt,
  });

  await sendOtpEmail(email, otp);

  const userResponse = user.toObject();
  delete userResponse.password;

  return userResponse;
};