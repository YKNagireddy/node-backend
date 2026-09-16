import SignUp from "../models/signupModels.js";
import {
  generateAccessToken,
  verifyRefreshToken,
} from "../common/jwtUtils.js";

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  };
};

export const meController = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await SignUp.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        loggedIn: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      loggedIn: true,
      data: {
        user,
      },
    });
  } catch (error) {
    console.error("Me error:", error);

    return res.status(401).json({
      success: false,
      loggedIn: false,
      message: "Not authenticated",
    });
  }
};

export const refreshController = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    const decoded = verifyRefreshToken(refreshToken);

    const user = await SignUp.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isEmailVerified) {
      return res.status(401).json({
        success: false,
        message: "Email is not verified",
      });
    }

    const newAccessToken = generateAccessToken(user);

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("accessToken", newAccessToken, {
      ...getCookieOptions(),
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Access token refreshed",
    });
  } catch (error) {
    console.error("Refresh error:", error);

    res.clearCookie("accessToken", getCookieOptions());
    res.clearCookie("refreshToken", getCookieOptions());

    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};

export const logoutController = async (req, res) => {
  try {
    const options = getCookieOptions();

    res.clearCookie("accessToken", options);
    res.clearCookie("refreshToken", options);

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};