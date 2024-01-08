// controllers/authController.js
const bcrypt = require('bcrypt');
const { pool } = require('../utils/database');
const { generateToken } = require('../utils/tokenUtil');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const [users] = await pool.query('SELECT * FROM Users WHERE username = ?', [username]);
        const user = users[0];

        if (user && await bcrypt.compare(password, user.password)) {
            const token = generateToken(user);
            return res.status(200).json({ 
                token,
                userID: user.user_id.toString()
            });
        } else {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


exports.logout = async (req, res) => {
    try {

        res.status(200).send(); 
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


