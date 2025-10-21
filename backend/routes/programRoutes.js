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
  deleteProgramByID,
  getProgramByID,
  getPrograms,
  updateProgramById
} from "../controllers/programController.js";

const router = Router();

router.get('/programs', getPrograms);
router.get('/programs/:id', validateParams(idParamSchema), getProgramByID);
router.delete('/programs/:id', validateParams(idParamSchema), deleteProgramByID);
router.post('/programs', validateBody(programSchema), createProgram);
router.put('/programs/:id', validateParams(idParamSchema), validateBody(updateProgramSchema), updateProgramById);

export default router;
