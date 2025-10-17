import express from 'express';
import dotenv from 'dotenv';
import schoolRouter from './routes/schoolRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health checks
app.get('/health', (_req, res) => res.send('OK'));
app.get('/health/db', async (_req, res) => {
});

// API routes under /api
app.use('/api', schoolRouter);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
