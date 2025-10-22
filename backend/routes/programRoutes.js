// backend/routes/programRoutes.js
import { Router } from 'express';
import {
  validateBody,
  validateParams
} from "../middleware/validateRequest.js";
import {
  programSchema,
  updateProgramSchema,
  idParamSchema
} from "../zodSchema/programSchema.js";
import {
  createProgram,
  deleteProgramById,
  getProgramById,
  getPrograms,
  updateProgramById
} from "../controllers/programController.js";

const router = Router();

// GET /api/programs
router.get('/programs', getPrograms);

// GET /api/programs/:id
router.get('/programs/:id', validateParams(idParamSchema), getProgramById);

// POST /api/programs
router.post('/programs', validateBody(programSchema), createProgram);

// PUT /api/programs/:id
router.put(
    '/programs/:id',
    validateParams(idParamSchema),
    validateBody(updateProgramSchema),
    updateProgramById
);

// DELETE /api/programs/:id
router.delete('/programs/:id', validateParams(idParamSchema), deleteProgramById);

export default router;
