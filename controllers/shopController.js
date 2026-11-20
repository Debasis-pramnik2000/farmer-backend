const Shop = require("../models/Shop");
const cloudinary = require("../config/cloudinary");

// ============================================================
// ADMIN: CREATE SHOP
// ============================================================
exports.createShop = async (req, res) => {
  try {
    const { name, address, state, district, block, phone, description, email } = req.body;

    if (!name || !address || !district) {
      return res.status(400).json({ message: "Name, address, district required" });
    }

    let photoUrl = "";

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "krishi_bondhu/shops" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      photoUrl = result.secure_url;
    }

    const shop = await Shop.create({
      name, address, state, district, block,
      phone, description, email, photoUrl,
    });

    res.status(201).json({ message: "Shop added", shop });
  } catch (error) {
    console.error("CREATE SHOP ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ============================================================
// ADMIN: UPDATE SHOP
// ============================================================
exports.updateShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    const { name, address, state, district, block, phone, description, email } = req.body;

    if (name) shop.name = name;
    if (address) shop.address = address;
    if (state) shop.state = state;
    if (district) shop.district = district;
    if (block) shop.block = block;
    if (phone) shop.phone = phone;
    if (description) shop.description = description;
    if (email) shop.email = email;

    // New photo
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "krishi_bondhu/shops" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      shop.photoUrl = result.secure_url;
    }

    await shop.save();
    res.json({ message: "Shop updated", shop });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================================================
// ADMIN: DELETE SHOP
// ============================================================
exports.deleteShop = async (req, res) => {
  try {
    const shop = await Shop.findByIdAndDelete(req.params.id);
    if (!shop) return res.status(404).json({ message: "Shop not found" });
    res.json({ message: "Shop deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================================================
// ADMIN: GET ALL SHOPS
// ============================================================
exports.getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find().sort({ createdAt: -1 });
    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================================================
// USER: GET SHOPS BY DISTRICT
// ============================================================
exports.getShopsByDistrict = async (req, res) => {
  try {
    const { state, district } = req.query;

    if (!district) {
      return res.status(400).json({ message: "District required" });
    }

    const filter = { district: { $regex: `^${escapeRegex(district)}$`, $options: "i" } };
    if (state) filter.state = { $regex: `^${escapeRegex(state)}$`, $options: "i" };

    const shops = await Shop.find(filter).sort({ block: 1, name: 1 });
    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================================================
// GET SHOP BY ID
// ============================================================
exports.getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ message: "Shop not found" });
    res.json(shop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================================================
function escapeRegex(v) {
  return String(v).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}