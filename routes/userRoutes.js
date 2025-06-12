const express = require('express');
const router = express.Router();
const passport = require('passport'); // Import Passport
// Removed: const { registerUser, loginUser } = require('../controllers/userController');
// Removed: const { body } = require('express-validator'); // No longer needed here if only for local auth

/**
 * @fileoverview User routes primarily for Google OAuth authentication and logout.
 * Local registration and login have been removed.
 */

// Local Registration and Login routes have been removed.

// Google OAuth Authentication Routes
/**
 * Initiates the Google OAuth authentication process.
 * Redirects the user to Google's authentication page.
 * @name GET /auth/google
 * @function
 * @memberof module:routes/userRoutes
 * @inner
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

/**
 * Callback route for Google OAuth authentication.
 * Google redirects here after the user authenticates.
 * Handles successful authentication or redirects to a failure page.
 * @name GET /auth/google/callback
 * @function
 * @memberof module:routes/userRoutes
 * @inner
 */
router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/users/auth/google/failure', // Redirect on authentication failure
    session: true, // Ensure session is established
  }),
  (req, res) => {
    // Successful authentication, redirect to a success page or send a success response.
    // For a real app, you might redirect to a frontend route like '/dashboard' or '/profile'.
    // req.user contains the authenticated user.
    res.redirect('/api/users/auth/success');
  }
);

/**
 * Temporary route to confirm successful Google authentication.
 * @name GET /auth/success
 * @function
 * @memberof module:routes/userRoutes
 * @inner
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
router.get('/auth/success', (req, res) => {
  if (req.isAuthenticated()) { // Check if user is authenticated
    res.send(`Successfully authenticated with Google! Welcome ${req.user.displayName || req.user.email}. User ID: ${req.user.id}`);
  } else {
    // If not authenticated, perhaps redirect to the Google login initiation
    res.redirect('/api/users/auth/google');
  }
});

/**
 * Route to handle Google authentication failures.
 * @name GET /auth/google/failure
 * @function
 * @memberof module:routes/userRoutes
 * @inner
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
router.get('/auth/google/failure', (req, res) => {
  res.status(401).send('Failed to authenticate with Google. Please try again.');
});

/**
 * Route to log out a user.
 * Clears the login session.
 * @name POST /logout
 * @function
 * @memberof module:routes/userRoutes
 * @inner
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
router.post('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err); // Pass error to the error handler
    }
    // Successful logout
    // You might want to redirect to the homepage or a public area.
    res.status(200).json({ message: 'Successfully logged out.' });
  });
});

module.exports = router;
