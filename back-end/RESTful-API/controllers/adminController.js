const fs = require('fs');
const csv = require('csv-parser');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();


const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB
});

async function healthCheck(req, res) {
    try {
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
        res.status(500).json({ status: "failed", dataconnection: connectionString