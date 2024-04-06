// routes/profileRoutes.js

const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authMiddleware');
const { getUsers, saveUsers } = require('../utils/userStorage');

// Get all user profiles (only accessible to admin users)
router.get('/profiles', authenticateUser, (req, res) => {
    const users = getUsers();
    res.json(users);
});

// Get user profile
router.get('/profile', authenticateUser, (req, res) => {
    const users = getUsers();
    const userProfile = users.find(user => user.username === req.user.username);
    if (!userProfile) {
        return res.status(404).json({ error: 'User profile not found' });
    }
    res.json(userProfile);
});

// Update user profile
router.put('/profile', authenticateUser, (req, res) => {
    const users = getUsers();
    const userProfileIndex = users.findIndex(user => user.username === req.user.username);
    if (userProfileIndex === -1) {
        return res.status(404).json({ error: 'User profile not found' });
    }
    // Update user profile based on request body
    users[userProfileIndex] = { ...users[userProfileIndex], ...req.body };
    saveUsers(users);
    res.json({ message: 'Profile updated successfully' });
});

module.exports = router;
