const axios = require('axios');
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

const paystack = axios.create({
  baseURL: process.env.PAYSTACK_BASE_URL,
  headers: {
    Authorization: `Bearer ${PAYSTACK_SECRET}`,
    'Content-Type': 'application/json',
  },
});

module.exports = paystack;
