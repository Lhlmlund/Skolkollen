import { prisma } from './prismaClient.js';

// Routers

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'

import quizRoutes from "./routes/quizRoutes.js";
import schoolRouter from './routes/schoolRoutes.js';
import programRouter from './routes/programRoutes.js';
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

// If FRONTEND_ORIGIN="*" → allow all (handy when Vite jumps to 5174/5175)
const corsOrigin = ORIGIN === "*" ? true : ORIGIN;

app.use(
  cors({
    origin: corsOrigin,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);

app.use(express.json());


// --- Health checks ---
app.get("/health", (_req, res) => res.send("OK"));
app.get("/health/db", async (_req, res) => {
  try {
    // MySQL ping via Prisma (return may differ by driver/platform)
    const rows = await prisma.$queryRawUnsafe("SELECT 1 AS ok");
    const row = Array.isArray(rows) ? rows[0] : rows;
    if (row && (row.ok === 1 || row.ok === "1")) return res.json({ db: "OK" });
    return res.status(500).json({ db: "Unexpected result" });
  } catch (e) {
    console.error("DB health error:", e);
    return res.status(500).json({ db: "ERROR", message: e.message });
  }
});

// --- API routes ---
app.use("/api", schoolRouter);    // /api/schools
app.use("/api/quiz", quizRoutes); // /api/quiz/questions, /api/quiz/submit
app.use('/api', programRouter)
app.use("/api/auth", authRoutes)
app.use("/api", userRoutes) // for dev purposes

// --- Error handler (JSON) ---
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

// Graceful shutdown for Prisma
const shutdown = async () => {
  try {
    await prisma.$disconnect();
  } finally {
    process.exit(0);
  }
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
