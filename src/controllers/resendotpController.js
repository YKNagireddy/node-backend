import { resendOtpService } from "../services/resendOtpService.js";

const resendOtpController = async (req, res) => {
  try {
    const result = await resendOtpService(req.body);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Resend OTP error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default resendOtpController;