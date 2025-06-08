const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    date: Date,
    time: String,
    location: String,
    cashPrize: Number,
    totalSeats: { type: Number, default: null },
    tokenCost: Number,
    tokenCap: Number,
    tokenReward: Number,
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, default: "pending" },
    entryFee: { type: Number, required: true },
    teamSize: { type: Number, default: 1 }, // Only one field
    seatsTaken: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
