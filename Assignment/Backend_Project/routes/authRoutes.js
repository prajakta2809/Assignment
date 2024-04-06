// routes/authRoutes.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const router = express.Router();
const { getUsers, saveUsers } = require('../utils/userStorage');

const JWT_SECRET = 'prajaktasecrectkey';
const GITHUB_CLIENT_ID = 'ecb0a11ca157be82588e'; // Replace with your GitHub client ID
const GITHUB_CLIENT_SECRET = '614787ec8828a1386f18b90ac3e44568681fc6e2'; // Replace with your GitHub client secret

// Register a new user
router.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Check if username already exists
    const users = getUsers();
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash the password
    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;

            // Save user to JSON file
            const newUser = { username, password: hash };
            users.push(newUser);
            saveUsers(users);

            const token = jwt.sign({ username: req.body.username }, JWT_SECRET);
            res.status(201).json({ message: 'User registered successfully', token });
        });
    });
});

// User login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Find user by username
    const users = getUsers();
    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Check password
    bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
            throw err;
        }
        if (isMatch) {
            const token = jwt.sign({ username: req.body.username }, JWT_SECRET);
            res.status(200).json({ message: 'Login successful', token });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

// Configure GitHub OAuth strategy
passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/api/auth/github/callback'
}, (accessToken, refreshToken, profile, done) => {
    // Find or create user based on GitHub profile (to be implemented)
    // For now, assume user is found or created and return the user object
    const users = getUsers();
    let user = users.find(u => u.githubId === profile.id); // Check if user exists by GitHub ID
    if (!user) {
        // User doesn't exist, create a new user
        user = {
            githubId: profile.id,
            username: profile.username,
            // Add other profile information you want to store
        };
        users.push(user);
        saveUsers(users);
    }
    return done(null, user);
}));

// Register a new user using GitHub OAuth
router.get('/github', passport.authenticate('github'));

// GitHub OAuth callback
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    // Generate JWT token
    const token = jwt.sign({ username: req.user.username }, JWT_SECRET);
    // Respond with the token
    res.json({ token });
});

module.exports = router;
