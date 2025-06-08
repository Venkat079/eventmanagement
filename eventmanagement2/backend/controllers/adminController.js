// backend/controllers/adminController.js

const Event = require("../models/Event");

exports.getPendingEvents = async (req, res) => {
  try {
    const pendingEvents = await Event.find({ status: "pending" });
    res.json(pendingEvents);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.approveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: "Event not found" });
    event.status = "approved";
    await event.save();
    res.json({ msg: "Event approved" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.rejectEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: "Event not found" });
    event.status = "rejected";
    await event.save();
    res.json({ msg: "Event rejected" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};
