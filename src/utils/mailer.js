// File: src/utils/mailer.js
const nodemailer = require('nodemailer');
require('dotenv').config();


const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: Number(process.env.EMAIL_PORT) === 465, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send HTML email
 * @param {string} to - recipient email address
 * @param {string} subject - subject of the email
 * @param {string} html - HTML body
 */
module.exports = async function sendEmail(to, subject, html) {
  try {
    await transporter.sendMail({
      from: `WealthWise <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to ${to}`);
    console.log("Trying to send email with config:", {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  user: process.env.EMAIL_USER
});

  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
  }
};
