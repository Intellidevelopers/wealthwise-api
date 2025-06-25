// File: src/server.js

require('dotenv').config(); // Load env vars first
const app = require('./app');
const sequelize = require('./config/db');

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('📦 MySQL connection established.');

    // Sync models (avoid force:true in production)
    await sequelize.sync();
    console.log('🔄 Models synchronized.');

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1); // Exit process with failure
  }
})();
