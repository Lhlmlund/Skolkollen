// backend/controllers/programController.js
import {
  listPrograms,
  getProgramById as getProgramByIdSvc,
  createProgram as createProgramSvc,
  deleteProgramById as deleteProgramByIdSvc,
  updateProgramById as updateProgramByIdSvc,
} from "../services/programService.js";

export async function getPrograms(_req, res) {
  try {
    const rows = await listPrograms();
    return res.json(rows);
  } catch (err) {
    console.error('getPrograms error:', err);
    return res.status(500).json({ error: 'Failed to fetch programs' });
  }
}

export async function getProgramById(req, res) {
  try {
    const id = Number(req.validated?.params?.id ?? req.params.id);
    const row = await getProgramByIdSvc(id);
    if (!row) return res.status(404).json({ error: `Program not found with id: ${id}` });
    return res.json(row);
  } catch (err) {
    console.error('getProgramById error:', err);
    return res.status(500).json({ error: 'Failed to fetch program' });
  }
}

export async function createProgram(req, res) {
  try {
    const data = buildProgramBody(req);
    const created = await createProgramSvc(data);
    return res.status(201).json(created);
  } catch (err) {
    console.error('createProgram error:', err);
    return res.status(500).json({ error: 'Failed to create program' });
  }
}

export async function updateProgramById(req, res) {
  try {
    const id = Number(req.validated?.params?.id ?? req.params.id);
    const data = buildProgramBody(req);
    const updated = await updateProgramByIdSvc(id, data);
    return res.json(updated);
  } catch (err) {
    console.error('updateProgramById error:', err);
    return res.status(500).json({ error: 'Failed to update program' });
  }
}

export async function deleteProgramById(req, res) {
  try {
    const id = Number(req.validated?.params?.id ?? req.params.id);
    await deleteProgramByIdSvc(id);
    return res.status(204).send();
  } catch (err) {
    console.error('deleteProgramById error:', err);
    return res.status(500).json({ error: 'Failed to delete program' });
  }
}

function buildProgramBody(req) {
  const { name, category, description } = req.validated?.body ?? req.body;
  const data = {};
  if (name !== undefined) data.name = name;
  if (category !== undefined) data.category = category;
  if (description !== undefined) data.description = description;
  return data;
}
