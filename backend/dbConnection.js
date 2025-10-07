import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config()
export async function connectDB(){
    try {
        const connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
        })
       console.log('Connected to DB')
        return connection;
   } catch (error){
       console.log('No DB connection')
       process.exit(1)
   }
}