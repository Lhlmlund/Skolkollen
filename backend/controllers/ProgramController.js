import {getPrograms as getProgramsSvc,
getProgramsById as getProgramByIdSvc,
createProgram as creatProgramSvc,
deleteProgramById as deleteProgramByIdSvc,
updateProgramById as updateProgramByIdSvc} from "../services/programService.js";

/**
* GET /api/programs
 */
export async function getPrograms(req, res){
    try {
        const rows = await getProgramsSvc()
        res.status(200).json(rows)
    }catch (error) {
        console.error('getPrograms error:', error)
        res.status(500).send('failed to fetch programs')
    }
}

/**
 * GET /api/programs/{id}
 */
export async function getProgramById(req, res){
    const id = Number(req.params.id)
    try {
        const row = await getProgramByIdSvc(id)
        res.status(200).json(row)
    }catch(error){
        console.error('getProgramById error:', error)
        res.status(500).send('failed to fetch program by Id:', id)
    }
}

/**
 * POST /api/programs/
 */
export async function createProgram(req, res){
    const {name, category, description } = res.body
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

/**
 * PUT /api/programs/{id}
 */
export async function updateProgramById (req, res){
    const id = Number(req.params.id);
    const {name, category, description} = req.body;
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

/**
 * DELETE /api/programs/{id}
 */
export async function deleteProgramById (req, res){
    const id = Number(req.params.id)
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