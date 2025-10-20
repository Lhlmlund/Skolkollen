// backend/controllers/schoolController.js
import {
  listSchools,
  getSchoolById,
  createSchool,
  updateSchoolById,
  deleteSchoolById,
} from '../services/schoolService.js';

export async function getSchools(req, res) {
  try {
    const { city } = req.query;         // Zod already validated/coerced
    const rows = await listSchools({ city });
    return res.json(rows);
  } catch (err) {
    console.error('getSchools error:', err);
    return res.status(500).json({ error: 'Failed to fetch schools' });
  }
}

export async function getSchoolByID(req, res) {
  try {
    const id = Number(req.params.id);
    const row = await getSchoolById(id);
    if (!row) return res.status(404).json({ error: `School not found with id: ${id}` });
    return res.json(row);
  } catch (err) {
    console.error('getSchoolByID error:', err);
    return res.status(500).json({ error: 'Failed to fetch school' });
  }
}

export async function createSchoolController(req, res) {
  try {
    const created = await createSchool(req.body); // {name, city, website, programIds}
    return res.status(201).json(created);
  } catch (err) {
    console.error('createSchool error:', err);
    return res.status(500).json({ error: 'Failed to create school' });
  }
}

export async function updateSchoolByID(req, res) {
  try {
    const id = Number(req.params.id);
    const updated = await updateSchoolById(id, req.body); // service handles programIds replacement
    return res.json(updated);
  } catch (err) {
    console.error('updateSchoolByID error:', err);
    return res.status(500).json({ error: 'Failed to update school' });
  }
}

export async function deleteSchoolByID(req, res) {
  try {
    const id = Number(req.params.id);
    await deleteSchoolById(id);
    return res.status(204).send();
  } catch (err) {
    console.error('deleteSchoolByID error:', err);
    return res.status(500).json({ error: 'Failed to delete school' });
  }
}
