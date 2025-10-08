import { Router } from 'express';
import { getSchools } from '../controllers/schoolController.js';

const router = Router();

// /api/schools
router.get('/schools', getSchools);

// simple ping
router.get('/ok', (_req, res) => res.send('ok'));

export default router;