import { getSchools as getSchoolsSvc } from '../services/schoolService.js';

/**
 * GET /api/schools
 */
export async function getSchools(req, res) {
  try {
    const rows = await getSchoolsSvc();
    // return array directly; frontend typically expects an array
    return res.json(rows);
  } catch (err) {
    console.error('getSchools error:', err);
    return res.status(500).json({ error: 'Failed to fetch schools' });
  }
}