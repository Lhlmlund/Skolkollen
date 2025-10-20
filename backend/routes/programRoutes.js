import { Router } from 'express';
import {validate} from "../middleware/validate.js";
import {programSchema, updateProgramSchema} from "../zodSchema/programShema.js";
import {
    createProgram,
    deleteProgramById,
    getProgramById,
    getPrograms,
    updateProgramById
} from "../controllers/ProgramController.js";

const router = Router();

router.get('/programs',getPrograms)
router.get('/programs/:id', getProgramById)
router.delete('/programs/:id', deleteProgramById)
router.post('/programs',validate(programSchema),createProgram)
router.put('/programs/:id',validate(updateProgramSchema),updateProgramById)

export default router;