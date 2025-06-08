// backend/controllers/eventController.js
const Event = require("../models/Event");
const Ticket = require("../models/Ticket"); // ✅ Required

// Create a new event (defaults to status="pending")
exports.createEvent = async (req, res) => {
  try {
    const data = {
      ...req.body,
      organizer: req.user._id,
      status: "pending",
    };
    const ev = await Event.create(data);
    res.status(201).json(ev);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};

// List only approved events
// List only approved events, now includes tokenUsedCount
exports.listEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "approved" }).populate(
      "organizer",
      "name email"
    );

    const eventsWithTokenCount = await Promise.all(
      events.map(async (event) => {
        const tokenUsedCount = await Ticket.countDocuments({
          event: event._id,
          usedTokens: true,
        });

        return {
          ...event.toObject(),
          tokenUsedCount,
        };
      })
    );

    res.json(eventsWithTokenCount);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};

// Get single event
exports.getEvent = async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id).populate(
      "organizer",
      "name email"
    );
    if (!ev) return res.status(404).json({ msg: "Event not found" });
    res.json(ev);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    let ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ msg: "Event not found" });
    ev = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(ev);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ msg: "Event not found" });
    await Event.findByIdAndDelete(req.params.id); // ✅ updated deletion
    res.json({ msg: "Event deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};

// List ALL events (Admin only)
exports.listAllEvents = async (req, res) => {
  if (req.user.role !== "Admin")
    return res.status(403).json({ msg: "Access denied" });

  try {
    const events = await Event.find()
      .sort({ createdAt: -1 })
      .populate("organizer", "name email"); // ✅ Include organizer details

    res.json(events);
  } catch (err) {
    console.error("Error fetching all events:", err);
    res.status(500).json({ msg: "Server Error" });
  }
};

// Approve a pending event (Admin only)
exports.approveEvent = async (req, res) => {
  if (req.user.role !== "Admin")
    return res.status(403).json({ msg: "Access denied" });

  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ msg: "Event not found" });

  event.status = "approved";
  await event.save();
  res.json({ msg: "Event approved", event });
};

// Get event with token used count (for student registration)
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    const tokenUsedCount = await Ticket.countDocuments({
      event: event._id,
      usedTokens: true,
    });

    res.json({ event, tokenUsedCount });
  } catch (err) {
    console.error("Error fetching event:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
//new code
