import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? 'sk_user',
  password: process.env.DB_PASSWORD ?? 'sk_pwd',
  database: process.env.DB_NAME ?? 'skolkollen',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});