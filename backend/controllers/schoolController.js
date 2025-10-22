// backend/controllers/schoolController.js
import {
  listSchools,
  getSchoolById as getSchoolByIdSvc,
  createSchool as createSchoolSvc,
  updateSchoolById as updateSchoolByIdSvc,
  deleteSchoolById as deleteSchoolByIdSvc,
} from '../services/schoolService.js';

export async function getSchools(req, res) {
  try {
    const { city } = req.validated?.query;
    const rows = await listSchools({ city });
    return res.json(rows);
  } catch (err) {
    console.error('getSchools error:', err);
    return res.status(500).json({ error: 'Failed to fetch schools' });
  }
}

export async function getSchoolById(req, res) {
  try {
    const id = Number(req.validated?.params.id);
    const row = await getSchoolByIdSvc(id);
    if (!row) return res.status(404).json({ error: `School not found with id: ${id}` });
    return res.json(row);
  } catch (err) {
    console.error('getSchoolById error:', err);
    return res.status(500).json({ error: 'Failed to fetch school' });
  }
}

export async function createSchool(req, res) {
  try {
    const data = checkRequestBody(req);
    const programIds = checkProgramIds(req)
    const created = await createSchoolSvc(data, programIds);
    return res.status(201).json(created);
  } catch (err) {
    console.error('createSchool error:', err);
    return res.status(500).json({ error: 'Failed to create school' });
  }
}

export async function updateSchoolById(req, res) {
  try {
    const idStr = (req.validated?.params ?? req.params).id;
    const id = Number(idStr);
    const data = checkRequestBody(req);
    const programIds = checkProgramIds(req);
    const updated = await updateSchoolByIdSvc(id, data, programIds);
    return res.json(updated);
  } catch (err) {
    console.error('updateSchoolByID error:', err);
    return res.status(500).json({ error: 'Failed to update school' });
  }
}

export async function deleteSchoolById(req, res) {
  try {
    const id = Number(req.validated?.params.id);
    await deleteSchoolByIdSvc(id);
    return res.status(204).send();
  } catch (err) {
    console.error('deleteSchoolByID error:', err);
    return res.status(500).json({ error: 'Failed to delete school' });
  }
}

function checkRequestBody(req) {
  const {name, city, website} = req.validated?.body ?? req.body;
  const data = {};

  if (name !== undefined) data.name = name;
  if (city !== undefined) data.city = city;
  if (website !== undefined) data.website = website;

  return data;
}

function checkProgramIds(req){
  const programIds = req.validated?.body ?? req.body;
  let checkedProgramIds = [];
  if (programIds !== undefined) checkedProgramIds = programIds
  return checkedProgramIds
}
