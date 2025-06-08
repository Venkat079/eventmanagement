const User = require("../models/User");

module.exports = async () => {
  console.log("Running token expiry job");
  const now = new Date();
  // Example: reset all tokens to 0 once yearly or implement transaction history
  // For demonstration, expire tokens older than a threshold:
  // await User.updateMany({ /* your criteria */ }, { tokens: 0 });
};
