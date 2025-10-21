// backend/controllers/programController.js
import {
    listPrograms,
    getProgramsById as getProgramByIdSvc,
    createProgram as creatProgramSvc,
    deleteProgramById as deleteProgramByIdSvc,
    updateProgramById as updateProgramByIdSvc
} from "../services/programService.js";


export async function getPrograms(req, res){
    try {
        const rows = await listPrograms();
        res.status(200).json(rows);
    }catch (err) {
        console.error('getPrograms error:', err);
        res.status(500).json({error: 'failed to fetch programs'});
    }
}


export async function getProgramByID(req, res){
    const id = Number(req.validated?.params.id);
    try {
        const row = await getProgramByIdSvc(id);
        res.status(200).json(row);
    }catch(err){
        console.error('getProgramById error:', err);
        res.status(500).send('failed to fetch program by Id:', id);
    }
}


export async function createProgram(req, res){
    const body = req.validated?.body ?? req.body;
    const {name, category, description } = body
    try {
        const program = await creatProgramSvc(name, category, description)
        res.status(200).json({
            success: true,
            program
        })
    } catch (error) {
        console.error('createProgram error:', error)
        res.status(500).send('failed to create program')
    }
}


export async function updateProgramById (req, res){
    const idStr = (req.validated?.params ?? req.params).id;
    const id = Number(idStr);
    const body = req.validated?.body ?? req.body;
    const {name, category, description} = body
    const data = {};

    if (name !== undefined) data.name = name;
    if (category !== undefined) data.category = category;
    if (description !== undefined) date.description = description;

    try {
        const row = await updateProgramByIdSvc(id, data)
        res.status(200).json({
            success: true,
            row
        })
    } catch (error) {
        console.error('updateProgramById error', error)
        res.status(500).send('failed to update program by id:', id)
    }

}

export async function deleteProgramByID (req, res){
    const id = Number(req.validated?.params.id)
    try{
        const row = await deleteProgramByIdSvc(id)
        res.status(200).json({
            success: true,
            row
        })
    }catch (error) {
        console.error('getDeleteProgramById error:', error)
        res.status(500).send('failed to delete program by id:', id)

    }
}