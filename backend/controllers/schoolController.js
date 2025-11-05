// backend/controllers/schoolController.js
import {
  listSchools,
  listSchoolsWithPrograms as listSchoolsWithProgramsSvc,
  listGymSchoolsWithPrograms as listGymSchoolsWithProgramsSvc,
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
  const {name, city, website,image_url, student_count, merit_value, description } = req.validated?.body ?? req.body;
  const data = {};

  if (name !== undefined) data.name = name;
  if (city !== undefined) data.city = city;
  if (website !== undefined) data.website = website;
  if (image_url !== undefined) data.image_url = image_url;
  if (student_count !== undefined) data.student_count = student_count;
  if (merit_value !== undefined) data.merit_value = merit_value;
  if (description !== undefined) data.description = description;

  return data;
}

function checkProgramIds(req){
  const programIds = req.validated?.body ?? req.body;
  let checkedProgramIds = [];
  if (programIds !== undefined) checkedProgramIds = programIds
  return checkedProgramIds
}

export async function getSchoolsWithPrograms(_req, res) {
  try {
    const schools = await listSchoolsWithProgramsSvc();
    res.json(schools);
  } catch (error) {
    console.error("Error fetching schools with programs:", error);
    res.status(500).json({ error: "Failed to fetch schools with programs" });
  }
}

export async function getGymnasiumSchoolsWithPrograms(req, res) {
  try {
    const rows = await listGymSchoolsWithProgramsSvc({ onlyGymnasium: true })
    res.json(rows)
  } catch (err) {
    console.error('Error fetching gymnasium schools:', err)
    res.status(500).json({ error: 'Failed to fetch gymnasium schools' })
  }
}