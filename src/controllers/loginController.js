import { loginService } from "../services/loginService.js";

const loginController = async (req, res) => {
  try {
    const result = await loginService(req.body);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default loginController;