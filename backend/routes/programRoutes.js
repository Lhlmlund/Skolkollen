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

router.get('/programs', getPrograms);
router.get('/programs/:id', validateParams(idParamSchema), getProgramById);
router.delete('/programs/:id', validateParams(idParamSchema), deleteProgramById);
router.post('/programs', validateBody(programSchema), createProgram);
router.put('/programs/:id', validateParams(idParamSchema), validateBody(updateProgramSchema), updateProgramById);

export default router;
