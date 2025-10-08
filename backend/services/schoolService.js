import { pool } from '../dbConnection.js';

/**
 * Retrieves all schools from the database.
 * @returns {Promise<Array<object>>}
 */
export async function getSchools() {
  const [rows] = await pool.query('SELECT * FROM school');
  return rows;
}