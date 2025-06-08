const Razorpay = require("razorpay");
const crypto = require("crypto");
const Ticket = require("../models/Ticket");
const Event = require("../models/Event");

const razorpay = new Razorpay({
  key_id: process.env.RAZOR_KEY,
  key_secret: process.env.RAZOR_SECRET,
});

const getKey = (req, res) => {
  res.json({ key: process.env.RAZOR_KEY });
};

const createOrder = async (req, res) => {
  try {
    const { eventId, teamMembers = [] } = req.body;
    const userId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const ticket = new Ticket({
      user: userId,
      event: eventId,
      useTokens: false,
      teamMembers,
    });
    await ticket.save();

    const order = await razorpay.orders.create({
      amount: event.entryFee * 100,
      currency: "INR",
      receipt: `ticket_${ticket._id}`,
    });

    res.json({ order, ticketId: ticket._id });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Order creation failed" });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      ticketId,
    } = req.body;

    const generatedSig = crypto
      .createHmac("sha256", process.env.RAZOR_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSig !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    ticket.paid = true;
    await ticket.save();

    res.json({ success: true, ticketId });
  } catch (error) {
    console.error("Verify Payment Error:", error);
    res.status(500).json({ message: "Payment verification failed" });
  }
};

module.exports = {
  getKey,
  createOrder,
  verifyPayment,
};
