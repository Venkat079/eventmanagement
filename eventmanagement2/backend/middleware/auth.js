// backend/middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  // Grab the Authorization header
  const authHeader = req.get("Authorization") || req.get("authorization");
  if (!authHeader) {
    return res.status(401).json({ msg: "No token provided" });
  }

  // Expect format "Bearer <token>"
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || !/^Bearer$/i.test(parts[0])) {
    return res.status(401).json({ msg: "Invalid authorization header format" });
  }

  const token = parts[1];

  try {
    // Verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Load user without password
    const user = await User.findById(payload.id).select("-password");
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    // Attach to request
    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({ msg: "Token is not valid" });
  }
};
//new code
