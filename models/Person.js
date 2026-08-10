const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    keywords: { type: [String], default: [] },
    logoUrl: { type: String, default: "" }, // Cloudinary secure_url
    logoPublicId: { type: String }, // needed to delete/replace the logo later
  },
  { _id: true }
);

const personSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
    companies: {
      type: [companySchema],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'At least one company is required',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Person', personSchema);
