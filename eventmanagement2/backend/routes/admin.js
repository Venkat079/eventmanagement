// backend/routes/admin.js
const router = require("express").Router();
const auth = require("../middleware/auth");
const { requireRole } = require("../middleware/role");
const adminCtrl = require("../controllers/adminController");

// list pending events (✅ corrected this line)
router.get(
  "/events/pending",
  auth,
  requireRole("Admin"),
  adminCtrl.getPendingEvents // ✅ this was wrong before
);

// approve / reject
router.post(
  "/events/:id/approve",
  auth,
  requireRole("Admin"),
  adminCtrl.approveEvent
);

router.post(
  "/events/:id/reject",
  auth,
  requireRole("Admin"),
  adminCtrl.rejectEvent
);

module.exports = router;
