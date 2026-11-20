const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getSchemesByState,
  getSchemeById,
} = require("../controllers/schemeController");

router.get("/", protect, getSchemesByState);
router.get("/:id", protect, getSchemeById);

module.exports = router;