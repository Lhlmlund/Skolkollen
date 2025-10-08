import db from "../dbConnection.js";

/**
 * Retrieves all schools from the database.
 * @returns {Promise<Array<object>>} A list of schools.
 * @throws {Error} If the database query fails.
 */
 export async function getSchools() {
    try {
        const [rows] = await db.query('SELECT * FROM school')
        return rows
    } catch (err) {
        console.error('Database error:', err)
        throw err
    }
}

