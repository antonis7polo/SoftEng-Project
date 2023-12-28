const mysql = require('mysql2/promise');
require('dotenv').config();

async function healthCheck(req, res) {
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB
        });

        await pool.query('SELECT 1'); // Simple query to test the connection
        const connectionString = [
            `Server=${process.env.DB_HOST}`,
            `Database=${process.env.DB}`,
            `Username=${process.env.DB_USER}`
        ];
        res.json({ status: "OK", dataconnection: connectionString });
    } catch (error) {
        const connectionString = [
            `Server=${process.env.DB_HOST}`,
            `Database=${process.env.DB}`,
            `Username=${process.env.DB_USER}`
        ];        
        res.status(500).json({ stat