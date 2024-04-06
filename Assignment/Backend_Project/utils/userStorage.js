// utils/userStorage.js

const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, 'users.json');

function getUsers() {
    try {
        const usersData = fs.readFileSync(usersFilePath, 'utf8');
        return JSON.parse(usersData);
    } catch (error) {
        // If file does not exist or error reading file, return empty array
        return [];
    }
}

function saveUsers(users) {
    const usersData = JSON.stringify(users, null, 2);
    fs.writeFileSync(usersFilePath, usersData);
}

module.exports = { getUsers, saveUsers };
