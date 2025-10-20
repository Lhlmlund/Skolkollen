import express from 'express';
import dotenv from 'dotenv';


import cors from 'cors'
import { pool } from './dbConnection.js';
import schoolRouter from './routes/schoolRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

// Enable CORS so frontend can talk to backend
app.use(cors({
  origin: ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false // we set true only if you use cookies/auth later
}));

app.use(express.json());

// Health checks
app.get('/health', (_req, res) => res.send('OK'));
app.get('/health/db', async (_req, res) => {
});

// API routes under /api
app.use('/api', schoolRouter);
app.use('/api',programRouter)

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
