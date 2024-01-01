const fs = require('fs');
const mysql = require('mysql2/promise');
const { Parser } = require('json2csv');
const bcrypt = require('bcrypt');
require('dotenv').config();
const pool = require('../utils/database').pool; 


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
        res.status(500).json({ status: "failed", dataconnection: connectionString });
    }
}


async function userMod(req, res) {
    const { username, password } = req.params;
    const { email, isAdmin } = req.body; // Receive email and isAdmin from request body

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const [users] = await pool.query('SELECT * FROM Users WHERE username = ?', [username]);
        if (users.length === 0) {
            await pool.query('INSERT INTO Users (username, email, password, isAdmin) VALUES (?, ?, ?, ?)', 
                [username, email, hashedPassword, isAdmin]);
            res.json({ message: "User created successfully." });
        } else {
            // User exists, update password (and potentially other details)
            await pool.query('UPDATE Users SET password = ?, email = ?, isAdmin = ? WHERE username = ?', 
                [hashedPassword, email, isAdmin, username]);
            res.json({ message: "User details updated successfully." });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to modify user', error: error.message });
    }
}


async function getUser(req, res) {
    const { username } = req.params;
    const format = req.query.format; 

    try {
        const [users] = await pool.query('SELECT username, password, email, isAdmin FROM Users WHERE username = ?', [username]);
        
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = users[0];

        if (format === 'csv') {
            const json2csvParser = new Parser();
            const csvData = json2csvParser.parse([user]); 

            res.header('Content-Type', 'text/csv');
            res.attachment('user.csv');
            return res.send(csvData);
        } else {
            res.json({ user });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user', error: error.message });
    }
}


module.exports = { healthCheck, userMod, getUser };
