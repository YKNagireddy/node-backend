import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    keywords: {
      type: [String],
      default: [],
    },

    logoUrl: {
      type: String,
      default: "",
    },

    logoPublicId: {
      type: String,
    },
  },
  {
    _id: true,
    timestamps: true,
  }
);

export default companySchema;