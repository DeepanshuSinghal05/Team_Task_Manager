const mysql = require('mysql2/promise');

// Use Railway's DATABASE_URL
const pool = mysql.createPool(process.env.DATABASE_URL);

// Test connection on startup
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Connected to MySQL");
    connection.release();
  } catch (error) {
    console.error("❌ Failed to connect to MySQL:", error.message);
  }
})();

module.exports = pool;