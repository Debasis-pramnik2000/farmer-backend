const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, gender, dob, mobile, state, district, village, password } = req.body;

    if (!name || !gender || !dob || !mobile || !state || !district || !village || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
      return res.status(400).json({ message: "Mobile must be 10 digits" });
    }

    if (password.length !== 6) {
      return res.status(400).json({ message: "Password must be exactly 6 characters" });
    }

    const existing = await User.findOne({ mobile });
    if (existing) {
      return res.status(400).json({ message: "Mobile number already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name, gender, dob, mobile, state, district, village,
      password: hashed,
      role: "user",
    });

    res.status(201).json({
      message: "Registration successful",
      user: { id: user._id, name: user.name, mobile: user.mobile },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN — User OR Admin
exports.login = async (req, res) => {
  try {
    const { mobile, password, email } = req.body;

    // ADMIN LOGIN
    if (email) {
      if (
        email !== process.env.ADMIN_EMAIL ||
        password !== process.env.ADMIN_PASSWORD
      ) {
        return res.status(400).json({ message: "Invalid admin credentials" });
      }

      const token = jwt.sign(
        { id: "admin", role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        message: "Admin login successful",
        token,
        role: "admin",
        user: { name: "Admin", email: process.env.ADMIN_EMAIL },
      });
    }

    // USER LOGIN
    if (!mobile || !password) {
      return res.status(400).json({ message: "Mobile and password required" });
    }

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(400).json({ message: "Please register first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role || "user" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      role: user.role || "user",
      user: {
        id: user._id,
        name: user.name,
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