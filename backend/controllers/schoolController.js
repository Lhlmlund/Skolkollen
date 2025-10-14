import {
  getSchools as getSchoolsSvc,
  getSchoolByID as getSchoolByIDSvc,
  deleteSchoolByID as deleteSchoolByIDScv,
  createSchool as createSchoolSvc,
  updateSchoolByID as updateSchoolByIDSvc,
} from '../services/schoolService.js';


/**
 * GET /api/schools
 * GET /api/schools?city={city}
 */
export async function getSchools(req, res) {
  try {
    const {city} = req.query
    let sql =''
    const params = []

    if (city) {sql += ' AND city = ?'; params.push(city)}
    //Room for more Filters

    const rows = await getSchoolsSvc(sql, params);
    return res.json(rows);
  } catch (err) {
    console.error('getSchools error:', err);
    return res.status(500).json({ error: 'Failed to fetch schools' });
  }
}

/**
 * GET /api/schools/{id}
 */
export async function getSchoolByID(req, res) {
  const id = req.params.id;
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  try {
    const row = await getSchoolByIDSvc(id);
    return res.json(row);
  } catch (err) {
    console.error('getSchoolByID error:', err);
    return res.status(500).json({
      error: `Failed to fetch school by id:${id}`,
    });
  }
}

/**
 * POST /api/schools
 */
export async function createSchool(req, res) {
  const { name, city, programs, open_house_date, website } = req.validateData
  try {
    const created = await createSchoolSvc({
      name,
      city,
      programs,
      open_house_date,
      website,
    });
    return res.status(201).json(created);
  } catch (err) {
    console.error('createSchool error:', err);
    return res.status(500).json({ error: 'Failed to create school' });
  }
}

/**
 * PUT /api/schools/{id}
 */
export async function updateSchoolByID(req, res) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const { name, city, programs, open_house_date, website } = req.body ?? {};
  const payload = { name, city, programs, open_house_date, website };
  const hasAnyField = Object.values(payload).some(v => v !== undefined);

  if (!hasAnyField) {
    return res
      .status(400)
      .json({ error: 'Provide at least one field to update' });
  }

  try {
    const updated = await updateSchoolByIDSvc(id, payload);
    if (!updated) {
      return res.status(404).json({ error: `School not found with id:${id}` });
    }
    return res.json(updated);
  } catch (err) {
    console.error('updateSchoolByID error:', err);
    return res.status(500).json({
      error: `Failed to update school by id:${id}`,
    });
  }
}

/**
 * DELETE /api/schools/{id}
 */
export async function deleteSchoolByID(req, res) {
  const id = req.params.id;
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  try {
    await deleteSchoolByIDScv(id);
    return res.status(200).json({
      Success: true
    })
  } catch (err) {
    console.log('deleteSchoolByID error:', err);
    return res.status(500).json({
      error: `Failed to delete school by id:${id}`,
    });
  }
}