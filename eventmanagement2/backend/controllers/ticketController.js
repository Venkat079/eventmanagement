// backend/controllers/ticketController.js
const Ticket = require("../models/Ticket");
const Event = require("../models/Event");
const User = require("../models/User");
const pdfGenerator = require("../utils/pdfGenerator");

exports.register = async (req, res) => {
  const { eventId, useTokens, teammates } = req.body;

  try {
    const ev = await Event.findById(eventId);
    if (!ev) return res.status(404).json({ msg: "Event not found" });

    const user = await User.findById(req.user._id);

    const tokenUsedCount = await Ticket.countDocuments({
      event: eventId,
      usedTokens: true,
    });

    let method = "cash";

    if (useTokens && tokenUsedCount < ev.tokenCap) {
      if (user.tokens >= ev.tokenCost) {
        user.tokens -= ev.tokenCost;
        method = "tokens";
      } else {
        return res.status(400).json({ msg: "Not enough tokens" });
      }
    }

    const teamSize = (teammates?.length || 0) + 1;

    if (ev.totalSeats !== null) {
      if ((ev.seatsTaken || 0) + teamSize > ev.totalSeats) {
        return res.status(400).json({ msg: "Not enough seats available" });
      }
      ev.seatsTaken = (ev.seatsTaken || 0) + teamSize;
    }

    const ticket = new Ticket({
      user: user._id,
      event: ev._id,
      usedTokens: method === "tokens",
    });

    await ticket.save();
    await ev.save();

    user.tokens += ev.tokenReward;
    await user.save();

    res.json({ ticket, method, teammates: teammates || [] });
  } catch (err) {
    console.error("Error in register:", err);
    res.status(500).json({ msg: "Server Error in registration" });
  }
};

exports.getTicketPDF = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("event")
      .populate("user");
    if (!ticket) return res.status(404).json({ msg: "Ticket not found" });

    // Teammates passed via query (encoded JSON string)
    const teammates = req.query.teammates
      ? JSON.parse(req.query.teammates)
      : [];

    const pdfBuffer = await pdfGenerator(ticket, teammates);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=ticket-${ticket._id}.pdf`,
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error("PDF error:", err);
    res.status(500).json({ msg: "Could not generate PDF" });
  }
};

exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("event")
      .populate("user");

    if (!ticket) {
      return res.status(404).json({ msg: "Ticket not found" });
    }

    res.json(ticket);
  } catch (err) {
    console.error("Error in getTicketById:", err);
    res.status(500).json({ msg: "Server error fetching ticket" });
  }
};
