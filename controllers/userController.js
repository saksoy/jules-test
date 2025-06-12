const { readData, writeData } = require('../utils/fileUtils');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const usersFilePath = './data/users.json';
const JWT_SECRET = 'your_jwt_secret'; // In a real app, use environment variables for this!

/**
 * Handles user registration.
 * Validates input, reads existing users, checks for duplicates, adds the new user, and saves back to the file.
 * @param {object} req - Express request object. Expected body: { email, password }.
 * @param {object} res - Express response object.
 */
function registerUser(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // This check is technically redundant due to express-validator, but kept for safety.
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const users = readData(usersFilePath);

    if (users.find(user => user.email === email)) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password, // In a real app, hash and salt the password!
    };

    users.push(newUser);
    writeData(usersFilePath, users);

    const userResponse = { ...newUser };
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Error in registerUser:', error);
    // Ensure this doesn't send a response if one has already been sent by validationResult
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error registering user.' });
    }
  }
}

/**
 * Handles user login.
 * Reads existing users, validates credentials, and returns a JWT if successful.
 * @param {object} req - Express request object. Expected body: { email, password }.
 * @param {object} res - Express response object.
 */
function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const users = readData(usersFilePath);
    const user = users.find(u => u.email === email);

    if (!user || user.password !== password) { // In a real app, compare hashed passwords!
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error in loginUser:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error logging in user.' });
    }
  }
}

module.exports = {
  registerUser,
  loginUser,
};
