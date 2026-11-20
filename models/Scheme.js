const mongoose = require("mongoose");

const schemeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    benefit: { type: String, required: true },
    eligibility: { type: String, required: true },
    category: { type: String, default: "Central" }, // Central / State
    state: { type: String, default: "" },           // empty = all India
    officialLink: { type: String, required: true },
    documents: { type: [String], default: [] },
    image: { type: String, default: "" },           // frontend image path
  },
  { timestamps: true }
);

module.exports = mongoose.model("Scheme", schemeSchema);