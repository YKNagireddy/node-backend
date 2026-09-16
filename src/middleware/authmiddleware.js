import { verifyAccessToken } from "../common/jwtUtils.js";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        loggedIn: false,
        message: "Authentication required",
      });
    }

    const decoded = verifyAccessToken(token);

    req.user = decoded;

    next();
  } catch (error) {
    console.error("Authorization error:", error);

    return res.status(401).json({
      success: false,
      loggedIn: false,
      message: "Invalid or expired access token",
    });
  }
};

export default authMiddleware;