const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');
const { body } = require('express-validator');

/**
 * @fileoverview User routes for registration and login.
 */

/**
 * Route to register a new user.
 * Validates email and password.
 * @name POST /register
 * @function
 * @memberof module:routes/userRoutes
 * @inner
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Please provide a valid email.'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long.'),
  ],
  registerUser
);

/**
 * Route to login an existing user.
 * @name POST /login
 * @function
 * @memberof module:routes/userRoutes
 * @inner
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
router.post('/login', loginUser);

module.exports = router;
