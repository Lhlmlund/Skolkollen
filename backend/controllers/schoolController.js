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
    const rows = await getSchoolsSvc();
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
  const id = Number(req.params.id);

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
  const { name, city, website, programIds = [] } = req.body
  try {

    const row = await createSchoolSvc(
      name,
      city,
      website,
      programIds
    );

    return res.status(201).json({
          success: true,
          row
        });

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

  const { name, city, website, programIds = [] } = req.body

  const data = {}

  if (name !== undefined) data.name = name;
  if (city !== undefined) data.city = city;
  if (website !== undefined) data.website = website;

  if (programIds){
    data.programs = {
      set: [], // clear all current connections
      connect: programIds.map((programId) => ({ program_id: programId })),
    }
  }


  try {
    const updated = await updateSchoolByIDSvc(id, data);
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
  const id = Number(req.params.id);

  try {
    const row = await deleteSchoolByIDScv(id);
    return res.status(200).json({
      Success: true,
      row
    })
  } catch (err) {
    console.log('deleteSchoolByID error:', err);
    return res.status(500).json({
      error: `Failed to delete school by id:${id}`,
    });
  }
}