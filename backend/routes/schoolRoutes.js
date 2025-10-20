// backend/routes/schoolRoutes.js
import express from 'express';
import {
  getSchools,
  getSchoolByID,
  createSchool,
  updateSchoolByID,
  deleteSchoolByID
} from '../controllers/schoolController.js';
<<<<<<< HEAD
import {validate} from "../middleware/validate.js";
import {schoolSchema, updateSchoolSchema} from "../zodSchema/schoolShema.js"
=======
>>>>>>> 3c2525c (align school routes with updated controller and import script)

import {
  validateBody,
  validateQuery,
  validateParams
} from '../middleware/validateRequest.js';

import {
  listQuerySchema,
  idParamSchema,
  schoolCreateSchema,
  schoolUpdateSchema
} from '../zodSchema/schoolSchema.js';

const router = express.Router();

// GET /api/schools?city=Göteborg
router.get('/schools', validateQuery(listQuerySchema), getSchools);

// GET /api/schools/:id
router.get('/schools/:id', validateParams(idParamSchema), getSchoolByID);

// POST /api/schools
router.post('/schools', validateBody(schoolCreateSchema), createSchool);

// PUT /api/schools/:id
router.put(
  '/schools/:id',
  validateParams(idParamSchema),
  validateBody(schoolUpdateSchema),
  updateSchoolByID
);

// DELETE /api/schools/:id
router.delete('/schools/:id', validateParams(idParamSchema), deleteSchoolByID);

export default router;
