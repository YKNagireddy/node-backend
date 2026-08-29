import { signupService } from "../services/signupService.js";

const signupController = async (req, res) => {
  try {
    const user = await signupService(req.body);

    return res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default signupController;