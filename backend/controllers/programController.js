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
        return res.status(200).json(rows);
    }catch (err) {
        console.error('getPrograms error:', err);
        return res.status(500).json({ error: 'failed to fetch programs'});
    }
}


export async function getProgramByID(req, res){
    try {
        const id = Number(req.validated?.params.id);
        const row = await getProgramByIdSvc(id);
        if(!row) return res.status(404).json({ error: `Program not found with id: ${id}`});
        return res.json(row);
    }catch(err){
        console.error('getProgramById error:', err);
        return res.status(500).json({ error: 'failed to fetch program'});
    }
}


export async function createProgram(req, res){
    try {
        const data = checkRequestBody(req);
        const created = await creatProgramSvc(data);
        return res.status(201).json(created);
    } catch (err) {
        console.error('createProgram error:', err);
        return res.status(500).json({ error: 'failed to create program'});
    }
}



export async function updateProgramById (req, res){
    try {
        const idStr = (req.validated?.params ?? req.params).id;
        const id = Number(idStr);
        const data = checkRequestBody(req);
        const updated = await updateProgramByIdSvc(id, data);
        return res.json(updated);
    } catch (err) {
        console.error('updateProgramById error', err);
        return res.status(500).json({ error: 'failed to update program'});
    }

}

export async function deleteProgramByID (req, res){
    const id = Number(req.validated?.params.id);
    try{
        const row = await deleteProgramByIdSvc(id);
        return res.status(204).send();
    }catch (err) {
        console.error('getDeleteProgramById error:', err)
        return res.status(500).json({ error: 'failed to delete program'})
    }
}

function checkRequestBody(req) {
    const {name, category, description} = req.validated?.body ?? req.body;
    const data = {};

    if (name !== undefined) data.name = name;
    if (category !== undefined) data.category = category;
    if (description !== undefined) date.description = description;
    return data;
}