import { resetPasswordService } from "../services/resetPasswordService.js";

const resetPasswordController = async (req, res) => {
  try {
    const result = await resetPasswordService(req.body);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    if (statusCode === 500) {
      console.error("Reset password error:", error);
    }

    return res.status(statusCode).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Something went wrong. Please try again.",
    });
  }
};

export default resetPasswordController;
