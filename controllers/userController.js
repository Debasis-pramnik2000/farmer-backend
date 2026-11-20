const mongoose = require("mongoose");
const User = require("../models/User");

const getAuthUserId = (req) => {
  return req.userId || req.user?._id || req.user?.id || req.user?.userId;
};

// GET logged-in user
exports.getMe = async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Invalid token payload" });
    }

    // Handle hardcoded/env admin login where ID is "admin" (not a MongoDB ObjectId)
    if (userId === "admin" || req.role === "admin" || req.user?.role === "admin") {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.json({
          _id: "admin",
          name: "Administrator",
          role: "admin",
          mobile: process.env.ADMIN_MOBILE || "Admin",
          state: "West Bengal",
          district: "Admin Panel",
          village: "-",
          profilePhoto: "",
        });
      }
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE user info
exports.updateMe = async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Invalid token payload" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Admin profile cannot be modified here" });
    }

    const { name, gender, dob, state, district, village } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (gender) user.gender = gender;
    if (dob) user.dob = dob;
    if (state) user.state = state;
    if (district) user.district = district;
    if (village) user.village = village;

    await user.save();

    res.json({
      message: "Profile updated",
      user: {
        id: user._id,
        name: user.name,
        gender: user.gender,
        dob: user.dob,
        mobile: user.mobile,
        state: user.state,
        district: user.district,
        village: user.village,
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPLOAD profile photo
exports.uploadPhoto = async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Invalid token payload" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Admin profile photo cannot be uploaded here" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profilePhoto = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({
      message: "Photo uploaded",
      profilePhoto: user.profilePhoto,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      totalUsers: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};