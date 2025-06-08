// backend/routes/tickets.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const ctrl = require("../controllers/ticketController");

// register for event
router.post("/register", auth, ctrl.register);

// download PDF
router.get("/:id/pdf", auth, ctrl.getTicketPDF);

router.get("/:id", auth, ctrl.getTicketById);

module.exports = router;
