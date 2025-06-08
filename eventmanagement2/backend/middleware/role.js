// backend/middleware/role.js
exports.requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({ msg: "Forbidden: insufficient role" });
  }
  next();
};
