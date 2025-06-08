// backend/routes/auth.js
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/authController");
const auth = require("../middleware/auth");
const User = require("../models/User");

// PUBLIC: register & login
router.post("/register", ctrl.register);
router.post("/login", ctrl.login);

// PROTECTED: get logged-in user's token balance
router.get("/me/tokens", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("tokens");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json({ tokens: user.tokens });
  } catch (err) {
    console.error("Error fetching token balance:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
