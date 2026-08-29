import mongoose from "mongoose";

const emailOtpSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SignUp",
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: {
        expires: 0,
      },
    },
  },
  {
    timestamps: true,
  },
);

const EmailOtp = mongoose.model("EmailOtp", emailOtpSchema);

export default EmailOtp;
