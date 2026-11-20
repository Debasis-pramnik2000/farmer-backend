const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    dob: { type: Date, required: true },
    mobile: { type: String, required: true, unique: true, match: /^[0-9]{10}$/ },
    state: { type: String, required: true },
    district: { type: String, required: true },
    village: { type: String, required: true },
    password: { type: String, required: true },
    profilePhoto: { type: String, default: "" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);