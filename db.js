const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "berkay123",
  database: "blogdb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

(async () => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    console.log('Database connected successfully!');
    console.log('Test Query Result:', rows[0].result);
  } catch (err) {
    console.error('Error connecting to the database:', err.message);
    process.exit(1);
  }
})();

module.exports = pool;
