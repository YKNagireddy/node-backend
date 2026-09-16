import SignUp from "../models/signupModels.js";
import { comparePassword } from "../common/passwordUtils.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../common/jwtUtils.js";

export const loginService = async (data) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await SignUp.findOne({
    email: email.toLowerCase().trim(),
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!user.isEmailVerified) {
    throw new Error("Please verify your email first");
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const userResponse = user.toObject();

  // Never send password to frontend
  delete userResponse.password;

  return {
    user: userResponse,
    accessToken,
    refreshToken,
  };
};