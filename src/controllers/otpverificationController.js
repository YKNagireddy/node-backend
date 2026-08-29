import { verifyOtpService } from "../services/otpverifyService.js";

const otpVerificationController = async (req, res) => {
  try {
    const result = await verifyOtpService(req.body);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("OTP verification error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default otpVerificationController;