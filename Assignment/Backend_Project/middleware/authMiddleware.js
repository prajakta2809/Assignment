// authMiddleware.js

const jwt = require('jsonwebtoken');
const { getUsers } = require('../utils/userStorage');

const JWT_SECRET = 'prajaktasecrectkey';

// Middleware to verify JWT token and authenticate user
function authenticateUser(req, res, next) {
    // Extract JWT token from Authorization header
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify JWT token
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        // Attach user information to request object for further processing
        req.user = decodedToken;
        next();
    });
}

// Middleware to authorize user based on role
function authorizeUser(role) {
    return (req, res, next) => {
        // Check if user has the required role
        const users = getUsers();
        const user = users.find(u => u.username === req.user.username);
        if (!user || (role && user.role !== role)) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        next();
    };
}

module.exports = {
    authenticateUser,
    authorizeUser
};
