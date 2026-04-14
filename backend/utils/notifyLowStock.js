const User = require("../models/User");
const sendEmail = require("./sendEmail");

const getAdminRecipients = async () => {
  const recipients = new Set();

  if (process.env.ADMIN_EMAIL) {
    recipients.add(process.env.ADMIN_EMAIL);
  }

  const admins = await User.find({ role: "admin" }).select("email");
  for (const admin of admins) {
    if (admin.email) {
      recipients.add(admin.email);
    }
  }

  return Array.from(recipients);
};

const notifyLowStock = async (item) => {
  if (!item || item.quantity > item.threshold) {
    return;
  }

  try {
    const recipients = await getAdminRecipients();
    if (!recipients.length) {
      console.log("Low stock alert skipped: no admin recipient found");
      return;
    }

    const result = await sendEmail(
      recipients,
      "Low Stock Alert",
      `${item.itemName} stock is low. Current stock: ${item.quantity}. Threshold: ${item.threshold}.`
    );

    if (!result?.success) {
      console.log(`Low stock alert failed for ${item.itemName}:`, result?.error);
    }
  } catch (error) {
    console.log("Low stock alert error:", error.message || error);
  }
};

module.exports = notifyLowStock;