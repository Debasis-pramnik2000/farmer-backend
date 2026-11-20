const Scheme = require("../models/Scheme");

// GET all schemes (all India + state-specific)
exports.getSchemesByState = async (req, res) => {
  try {
    const { state } = req.query;

    let schemes;

    if (state) {
      schemes = await Scheme.find({
        $or: [{ state: state }, { state: "" }],
      }).sort({ title: 1 });
    } else {
      schemes = await Scheme.find({}).sort({ title: 1 });
    }

    res.json({ count: schemes.length, data: schemes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single scheme details
exports.getSchemeById = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);

    if (!scheme) {
      return res.status(404).json({ message: "Scheme not found" });
    }

    res.json(scheme);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};