// backend/routes/events.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const eventCtrl = require("../controllers/eventController");

// Admin-only: list ALL events (pending & approved)
router.get("/all", auth, eventCtrl.listAllEvents);

// Admin-only: approve a pending event
router.put("/:id/approve", auth, eventCtrl.approveEvent);

// Create a new event (any authenticated user)
router.post("/", auth, eventCtrl.createEvent);

// Update or delete (creator or admin)
router.put("/:id", auth, eventCtrl.updateEvent);
router.delete("/:id", auth, eventCtrl.deleteEvent);

// Get one event (public)
router.get("/:id", eventCtrl.getEvent);

// List only approved events (public)
router.get("/", eventCtrl.listEvents);

router.get("/:id", eventCtrl.getEventById);

module.exports = router;
