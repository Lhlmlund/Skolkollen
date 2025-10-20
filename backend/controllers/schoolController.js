// backend/controllers/schoolController.js
import {
  listSchools,
  getSchoolById,
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

export async function getSchoolByID(req, res) {
  try {
    const id = Number(req.validated?.params.id);
    const row = await getSchoolById(id);
    if (!row) return res.status(404).json({ error: `School not found with id: ${id}` });
    return res.json(row);
  } catch (err) {
    console.error('getSchoolByID error:', err);
    return res.status(500).json({ error: 'Failed to fetch school' });
  }
}

export async function createSchool(req, res) {
  try {
    const body = req.validated?.body ?? req.body;
    const created = await createSchoolSvc(body);
    return res.status(201).json(created);
  } catch (err) {
    console.error('createSchool error:', err);
    return res.status(500).json({ error: 'Failed to create school' });
  }
}

export async function updateSchoolByID(req, res) {
  try {
    const idStr = (req.validated?.params ?? req.params).id;
    const id = Number(idStr);
    const body = req.validated?.body ?? req.body;
    const updated = await updateSchoolByIdSvc(id, body);
    return res.json(updated);
  } catch (err) {
    console.error('updateSchoolByID error:', err);
    return res.status(500).json({ error: 'Failed to update school' });
  }
}

export async function deleteSchoolByID(req, res) {
  try {
    const id = Number(req.params.id);
    await deleteSchoolByIdSvc(id);
    return res.status(204).send();
  } catch (err) {
    console.error('deleteSchoolByID error:', err);
    return res.status(500).json({ error: 'Failed to delete school' });
  }
}
