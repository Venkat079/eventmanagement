require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");

// routes
const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const paymentRoutes = require("./routes/payments");
const ticketRoutes = require("./routes/tickets");
const adminRoutes = require("./routes/admin");

// jobs
const expireTokensJob = require("./jobs/expireTokens");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/admin", adminRoutes);

cron.schedule("0 0 * * *", expireTokensJob);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
