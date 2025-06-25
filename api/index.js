const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('../src/config/db'); // make sure this exports a connectDB() function
const authRoutes = require('../src/routes/auth.routes');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.get('/', (req, res) => {
  res.send('API is live 🚀');
});

// MongoDB connection flag
let isConnected = false;

// Vercel-compatible handler
const handler = async (req, res) => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  return serverless(app)(req, res);
};

module.exports = handler;
