import express from "express";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// shared pool for queries
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "sk_user",
  password: process.env.DB_PASSWORD || "sk_pwd",
  database: process.env.DB_NAME || "skolkollen",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.get("/health", (_req, res) => res.send("OK"));

// DB health endpoint: on select 
app.get("/health/db", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    if (rows && rows[0]?.ok === 1) return res.json({ db: "OK" });
    res.status(500).json({ db: "Unexpected result" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ db: "ERROR", message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
