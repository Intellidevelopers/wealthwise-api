const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

exports.initiateFlutterwavePayment = async (req, res) => {
  try {
    const { amount, email, fullName, courseId, customizationTitle } = req.body;

    const tx_ref = `LMS-${uuidv4()}`;

    const paymentData = {
      tx_ref,
      amount,
      currency: 'NGN',
      redirect_url: process.env.FLW_REDIRECT_URL,
      customer: {
        email,
        name: fullName,
      },
      customizations: {
        title: customizationTitle || 'LMS Course Payment', // ← dynamic title fallback
        description: 'Pay to enroll in this course',
      },
      meta: {
        courseId,
      },
    };

    const flutterwaveRes = await axios.post(
      `${process.env.FLW_BASE_URL}/payments`,
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const { data } = flutterwaveRes.data;

    return res.status(200).json({ paymentUrl: data.link });
  } catch (error) {
    console.error('Flutterwave Init Error:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Payment initialization failed' });
  }
};
