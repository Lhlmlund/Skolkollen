import { pool } from '../dbConnection.js';

/**
 * Retrieves all schools from the database.
 * @returns {Promise<Array<object>>}
 */
export async function getSchools() {
  const [rows] = await pool.query('SELECT * FROM school WHERE 1=1');
  return rows;
}

/**
 * Retrieves a single school by ID.
 * @param {number|string} id
 * @returns {Promise<object|null>}
 */
export async function getSchoolByID(id) {
  const [rows] = await pool.query('SELECT * FROM school WHERE id = ?', [id]);
  return rows[0] ?? null;
}

/**
 * Creates a new school.
 * @param {{name:string, city?:string, programs?:string, open_house_date?:string|Date, website?:string}} school
 * @returns {Promise<object>}
 */
export async function createSchool(school) {
  const {
    name,
    city = null,
    programs = null,
    open_house_date = null,
    website = null,
  } = school;

  const [result] = await pool.query(
    `
    INSERT INTO school (name, city, programs, open_house_date, website)
    VALUES (?, ?, ?, ?, ?)
    `,
    [name, city, programs, open_house_date, website]
  );

  return getSchoolByID(result.insertId);
}

/**
 * Updates an existing school by ID.
 * Only provided fields will be updated.
 * @param {number} id
 * @param {{name?:string, city?:string, programs?:string, open_house_date?:string|Date, website?:string}} fields
 * @returns {Promise<object|null>} Updated row or null if not found/no change
 */
export async function updateSchoolByID(id, fields) {
  const allowed = ['name', 'city', 'programs', 'open_house_date', 'website'];
  const setParts = [];
  const params = [];

  for (const key of allowed) {
    if (fields[key] !== undefined) {
      setParts.push(`${key} = ?`);
      params.push(fields[key]);
    }
  }

  if (setParts.length === 0) {
    return null;
  }

  params.push(id);

  const [result] = await pool.query(
    `UPDATE school SET ${setParts.join(', ')} WHERE id = ?`,
    params
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return getSchoolByID(id);
}

/**
 * Delete a school by ID.
 * @param {number|string} id
 * @returns {Promise<number>} affected rows
 */
export async function deleteSchoolByID(id) {
  const [result] = await pool.query('DELETE FROM school WHERE id = ?', [id]);
  return result.affectedRows;
}