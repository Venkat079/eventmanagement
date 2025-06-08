const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["Student", "Organizer", "Admin"],
      default: "Student",
    },
    tokens: { type: Number, default: 0 },
    // optionally track token transactions with expiry
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
