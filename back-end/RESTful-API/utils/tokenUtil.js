const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    const payload = {
        userId: user.user_id,
        isAdmin: user.isAdmin 
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = { generateToken };
