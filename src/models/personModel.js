import mongoose from "mongoose";
import companySchema from "./companyModel.js";

const personSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      unique: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    companies: {
      type: [companySchema],
      required: true,

      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "At least one company is required",
      },
    },
  },
  {
    timestamps: true,
  }
);

const Person = mongoose.model("Person", personSchema);

export default Person;