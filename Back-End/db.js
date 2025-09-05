// Back-End/db.js
require('dotenv').config();
const sql = require('mssql');

const config = {
  user:     process.env.DB_USER,
  password: process.env.DB_PASS,
  server:   process.env.DB_SERVER,
  port:     Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

async function connect() {
  try {
    await sql.connect(config);
    console.log('✅ Connected to SQL Server');
  } catch (err) {
    console.error('❌ SQL Connection Error:', err);
    process.exit(1);
  }
}

module.exports = { sql, connect };
