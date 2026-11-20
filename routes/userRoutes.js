const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const {
  getMe,
  updateMe,
  uploadPhoto,
  getAllUsers,
} = require("../controllers/userController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, `${req.userId || "user"}_${Date.now()}${path.extname(file.originalname)}`),
});

const upload = multer({ storage });

router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.post("/me/photo", protect, upload.single("photo"), uploadPhoto);

// Admin route
router.get("/all", adminOnly, getAllUsers);

module.exports = router;