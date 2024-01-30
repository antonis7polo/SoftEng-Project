const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config(); 

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB,
    port : process.env.DB_PORT
});

async function createUser(username, email, password) {
    try {
        const query = 'SELECT * FROM Users WHERE username = ? OR email = ?';
        const [existingUsers] = await pool.query(query, [username, email]);

        if (existingUsers.length > 0) {
            // Determine which one is the duplicate
            const isUsernameTaken = existingUsers.some(user => user.username === username);
            const isEmailTaken = existingUsers.some(user => user.email === email);

            if (isUsernameTaken) {
                console.error(`Error: Username ${username} is already taken.`);
                return;
            }

            if (isEmailTaken) {
                console.error(`Error: Email ${email} is already in use.`);
                return;
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query('INSERT INTO Users (username, email, password, isAdmin) VALUES (?, ?, ?, true)', [username, email, hashedPassword]);
        console.log(`User ${username} created successfully.`);
    } catch (err) {
        console.error(`Error creating user: ${err.message}`);
    }
}

const [username, email, password] = process.argv.slice(2);

if (!username || !email || !password) {
    console.error("Usage: node createUser.js <username> <email> <password>");
    process.exit(1);
}

createUser(username, email, password);
