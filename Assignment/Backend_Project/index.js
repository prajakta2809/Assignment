// index.js

const express = require('express');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const jwt = require('jsonwebtoken');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Authentication routes
app.use('/api/auth', authRoutes);

// Profile routes
app.use('/api/profile', authenticateUser, profileRoutes);

// Authentication middleware
function authenticateUser(req, res, next) {
    // Check if user is authenticated
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Set user information in request object
        req.user = decoded;

        // Authorization check
        const isAdmin = req.user.isAdmin; // Assuming isAdmin is a property in the decoded token
        const isOwner = req.params.userId === req.user.userId;

        if (isAdmin || isOwner) {
            next();
        } else {
            res.status(403).json({ error: 'Forbidden' }); // User is not authorized to access this resource
        }
    });
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
