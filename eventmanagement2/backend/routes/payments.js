const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getKey,
  createOrder,
  verifyPayment,
} = require("../controllers/paymentController");

router.get("/key", auth, getKey);
router.post("/create-order", auth, createOrder);
router.post("/verify", auth, verifyPayment);

module.exports = router;
