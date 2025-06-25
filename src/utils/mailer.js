// File: src/utils/mailer.js
const nodemailer = require('nodemailer');

module.exports = async function sendEmail(to, subject, text) {
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true, // use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

  await transporter.sendMail({
    from: `LMS <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text
  });
};


