const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// import your routes
const authRoutes = require('../src/routes/auth.routes'); // adjust if needed
app.use('/api/auth', authRoutes);

// root route
app.get('/', (req, res) => {
  res.send('API is live 🚀');
});

// export as handler
module.exports = serverless(app);
