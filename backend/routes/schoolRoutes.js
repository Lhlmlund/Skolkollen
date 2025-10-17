import { Router } from 'express';
import {
  getSchools,
  getSchoolByID,
  createSchool,
  updateSchoolByID, deleteSchoolByID,
} from '../controllers/schoolController.js';
import {validate} from "../middleware/validate.js";
import {schoolSchema} from "../zodSchema/schoolShema.js"

const router = Router();

// /api/schools
router.get('/schools', getSchools);
//validate(schoolSchema),
router.post('/schools', createSchool);

// /api/schools/{id}
router.get('/schools/:id', getSchoolByID);
router.put('/schools/:id', updateSchoolByID);
router.delete('/schools/:id', deleteSchoolByID);

// simple ping
router.get('/ok', (_req, res) => res.send('ok'));

export default router;