import express from "express";

import uploadLogos from "../middleware/uploadMiddleware.js";
import authMiddleware from "../middleware/authmiddleware.js";

import {
  createPersonController,
  getAllPersonsController,
  seedPersonController,
} from "../controllers/personController.js";

import signupController from "../controllers/signupController.js";
import loginController from "../controllers/loginController.js";
import otpVerificationController from "../controllers/otpverificationController.js";
import resendOtpController from "../controllers/resendotpController.js";
import forgotPasswordController from "../controllers/forgotPasswordController.js";
import resetPasswordController from "../controllers/resetPasswordController.js";

import {
  meController,
  refreshController,
  logoutController,
} from "../controllers/authController.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public routes
|--------------------------------------------------------------------------
*/

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

// Step 1: send a password reset OTP to the user's email
router.post(
  "/forgot-password",
  forgotPasswordController
);

// Step 2: verify the OTP and set a new password
router.post(
  "/reset-password",
  resetPasswordController
);

/*
|--------------------------------------------------------------------------
| Authentication routes
|--------------------------------------------------------------------------
*/

// Check whether user is logged in
router.get(
  "/me",
  authMiddleware,
  meController
);

// Get a new access token using refresh token
router.post(
  "/refresh",
  refreshController
);

// Logout
router.post(
  "/logout",
  logoutController
);

/*
|--------------------------------------------------------------------------
| Protected routes
|--------------------------------------------------------------------------
*/

// Example:
// router.post("/protected-route", authMiddleware, controller);

export default router;