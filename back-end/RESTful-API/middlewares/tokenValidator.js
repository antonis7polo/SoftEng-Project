const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
    const token = req.headers['x-observatory-auth'];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Token is valid, attach decoded data to request and proceed
        req.user = decoded;
        
        
        next();
    });
};

module.exports = validateToken;
