import mongoose from "mongoose";

const signupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobilenumber: {
      type: String,
      required: true,
    },
    businessName: {
      type: String,
      trim: true,
    },
    businessGst: {
      type: String,
      trim: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const SignUp = mongoose.model("SignUp", signupSchema);
export default SignUp;
