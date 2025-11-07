import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'tr1-mysql',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '1234',
  database: process.env.DB_NAME || 'fitAi',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
