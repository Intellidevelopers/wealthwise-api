// File: src/server.js

require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/db');

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connected');

    await sequelize.sync();
    console.log('📦 Models synced');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ DB connection error:', err);
    process.exit(1);
  }
})();

