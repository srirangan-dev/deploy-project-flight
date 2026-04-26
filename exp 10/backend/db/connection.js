const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const pool = mysql.createPool({
  host:               process.env.MYSQLHOST,
  user:               process.env.MYSQLUSER,
  password:           process.env.MYSQLPASSWORD,
  database:           process.env.MYSQLDATABASE,
  port:               parseInt(process.env.MYSQLPORT) || 27261,
  waitForConnections: true,
  connectionLimit:    10,
  connectTimeout:     30000,
  ssl:                { rejectUnauthorized: false },
});

const db = pool.promise();

db.getConnection()
  .then(conn => {
    console.log("✅ MySQL connected successfully");
    conn.release();
  })
  .catch(err => console.error("❌ DB connection failed:", err.message));

module.exports = db;