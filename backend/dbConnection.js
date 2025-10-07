import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config()

// creates a pool instead of a connection every query
const connection = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

const db = connection.promise()

export default db