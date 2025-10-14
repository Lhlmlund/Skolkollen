import { Router } from 'express';
import {
  getSchools,
  getSchoolByID,
  createSchool,
  updateSchoolByID,
} from '../controllers/schoolController.js';
import {validate} from "../middleware/validate.js";
import {schoolSchema} from "../schema/schoolShema.js"

const router = Router();

// /api/schools
router.get('/schools', getSchools);
router.post('/schools', validate(schoolSchema), createSchool);

// /api/schools/{id}
router.get('/schools/:id', getSchoolByID);
router.put('/schools/:id', updateSchoolByID);

// simple ping
router.get('/ok', (_req, res) => res.send('ok'));

export default router;