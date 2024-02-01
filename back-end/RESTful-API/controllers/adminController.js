const fs = require('fs');
const mysql = require('mysql2/promise');
const { Parser } = require('json2csv');
const bcrypt = require('bcrypt');
require('dotenv').config();
const pool = require('../utils/database').pool; 

async function healthCheck(req, res) {
    const format = req.query.format;
    const connectionString = [
        `Server=${process.env.DB_HOST}`,
        `Database=${process.env.DB}`,
        `Username=${process.env.DB_USER}`,
        `Password=${process.env.DB_PASS}`,
    ];

    const healthData = {
        status: "OK",
        dataconnection: connectionString
    };

    try {
        await pool.query('SELECT 1');
        if (format === 'csv') {
            const json2csvParser = new Parser({
                transforms: [(data) => {
                    // Convert dataconnection array to a string for CSV
                    data.dataconnection = data.dataconnection.join('; ');
                    return data;
                }]
            });
            const csvData = json2csvParser.parse([healthData]);
            res.header('Content-Type', 'text/csv');
            res.send(csvData);
        } else {
            res.json(healthData);
        }
    } catch (error) {
        healthData.status = "failed";
        if (format === 'csv') {
            const json2csvParser = new Parser({
                transforms: [(data) => {
                    data.dataconnection = data.dataconnection.join('; ');
                    return data;
                }]
            });
            const csvData = json2csvParser.parse([healthData]);
            res.header('Content-Type', 'text/csv');
            res.status(200).send(csvData);
        } else {
            res.status(200).json(healthData);
        }
    }
}



async function userMod(req, res) {
    const { username, password } = req.params;
    const { email, isAdmin } = req.body; // Receive email and isAdmin from request body

    if (email === undefined || isAdmin === undefined) {
        return res.status(400).json({ message: 'Bad Request: Missing required fields.' });
    }

    if (isAdmin !== "0" && isAdmin !== "1") {
        return res.status(400).json({ message: "Bad Request: isAdmin must be either '0' or '1'." });
    }

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
        const [users] = await pool.query('SELECT username, password, email, isAdmin, created_at FROM Users WHERE username = ?', [username]);
        
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = users[0];

        user.isAdmin = user.isAdmin.toString();


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
