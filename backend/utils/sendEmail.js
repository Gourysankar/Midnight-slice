const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {

  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("Email config missing: set EMAIL_USER and EMAIL_PASS in backend .env");
      return { success: false, error: "Missing email credentials" };
    }

    const recipients = Array.isArray(to)
      ? to.filter(Boolean).join(",")
      : to;

    if (!recipients) {
      console.log("Email skipped: recipient is empty");
      return { success: false, error: "Missing recipient" };
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipients,
      subject: subject,
      text: text
    });

    console.log(`Email sent to ${recipients}:`, info.response);
    return { success: true, response: info.response };

  } catch (error) {

    console.log("Email error:", error.message || error);
    return { success: false, error: error.message || String(error) };

  }

};

module.exports = sendEmail;