require('dotenv').config();
const nodemailer = require('nodemailer');

async function testSMTP() {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: Number(process.env.EMAIL_PORT) === 465, // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    // Verify connection
    await transporter.verify();
    console.log('✅ SMTP server is ready to send emails');

    // Try sending a test email
    const info = await transporter.sendMail({
      from: `LMS <${process.env.EMAIL_USER}>`,
      to: process.env.TEST_RECEIVER_EMAIL, // set this in your .env too
      subject: 'SMTP Test Email',
      html: '<h1>This is a test email from LMS SMTP setup</h1>',
    });

    console.log('📧 Message sent: %s', info.messageId);
  } catch (err) {
    console.error('❌ SMTP test failed:', err.message);
  }
}

testSMTP();
