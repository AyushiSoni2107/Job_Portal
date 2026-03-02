const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: String, required: true },
    location: { type: String },
    category: { type: [String], default: [] },

    type: {
      type: String,
      enum: ["Remote", "Full-Time", "Part-Time", "Internship", "Contract"],
      required: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Employer
    },

    salaryMin: { type: Number },
    salaryMax: { type: Number },
    currency: {
      type: String,
      enum: ["INR", "USD", "EUR", "GBP", "AED"],
      default: "INR",
    },

    isClosed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
