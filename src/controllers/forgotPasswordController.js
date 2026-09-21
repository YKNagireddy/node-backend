import { forgotPasswordService } from "../services/forgotPasswordService.js";

const forgotPasswordController = async (req, res) => {
  try {
    const result = await forgotPasswordService(req.body);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    if (statusCode === 500) {
      console.error("Forgot password error:", error);
    }

    return res.status(statusCode).json({
      success: false,
      // Only expose messages we deliberately raised; hide internal errors.
      message: error.statusCode
        ? error.message
        : "Something went wrong. Please try again.",
    });
  }
};

export default forgotPasswordController;
