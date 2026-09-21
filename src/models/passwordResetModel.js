import mongoose from "mongoose";

// Kept separate from EmailOtp on purpose: EmailOtp is used for signup email
// verification, and mixing the two would let one flow consume / delete the
// other's OTP.
const passwordResetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SignUp",
      required: true,
      index: true,
    },
    // OTP is stored hashed, never in plain text.
    otpHash: {
      type: String,
      required: true,
    },
    // Wrong guesses so far. Capped in the reset service to stop brute-forcing.
    attempts: {
      type: Number,
      default: 0,
    },
    // MongoDB automatically deletes the document after this time (TTL index).
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
    versionKey: false,
  },
);

const PasswordReset = mongoose.model("PasswordReset", passwordResetSchema);

export default PasswordReset;