import db from "../dbConnection.js";

 export async function getSchools() {
    try {
        const [rows] = await db.query('SELECT * FROM school')
        return rows
    } catch (err) {
        console.error('Database error:', err)
        throw err
    }
}

