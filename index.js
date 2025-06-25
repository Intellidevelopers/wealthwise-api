const serverless = require('serverless-http');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const appSetup = require('./app'); // this sets up routes and middleware

dotenv.config();
connectDB(); // connect to MongoDB

const app = express();

// attach your app logic
app.use(appSetup);

// export handler for Vercel
module.exports = serverless(app);
