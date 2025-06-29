// utils/flutterwave.js
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY; // Put in .env

exports.initializePayment = async ({ email, amount, courseId, studentId }) => {
  const tx_ref = uuidv4();

  const response = await axios.post(
    'https://api.flutterwave.com/v3/payments',
    {
      tx_ref,
      amount,
      currency: 'NGN',
      redirect_url: `${process.env.CLIENT_URL}/payment/verify?tx_ref=${tx_ref}&courseId=${courseId}`,
      customer: {
        email,
      },
      meta: {
        studentId,
        courseId,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${FLW_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return { paymentUrl: response.data.data.link, tx_ref };
};

exports.verifyPayment = async (tx_ref) => {
  const response = await axios.get(`https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${tx_ref}`, {
    headers: {
      Authorization: `Bearer ${FLW_SECRET_KEY}`,
    },
  });

  return response.data;
};
