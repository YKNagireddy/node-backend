import express from "express";
import uploadLogos from "../middleware/uploadMiddleware.js";
import authMiddleware from '../middleware/authmiddleware.js'
import {
  createPersonController,
  getAllPersonsController,
  seedPersonController,
} from "../controllers/personController.js";
import signupController from "../controllers/signupController.js"
import loginController from "../controllers/loginController.js";
import otpVerificationController from "../controllers/otpverificationController.js";
import resendOtpController from "../controllers/resendotpController.js";

const router = express.Router();

router.post(
  "/",
  uploadLogos,
  createPersonController
);

router.get(
  "/",
  getAllPersonsController
);

router.post(
  "/seed",
  seedPersonController
);

router.post(
  "/signup",
  signupController
);

router.post(
  "/login",
  loginController
);

router.post(
  "/otpverify",
  otpVerificationController
);

router.post(
  "/resendotp",
  resendOtpController
);

export default router;