/**
 * @fileoverview Authentication middleware for verifying user sessions.
 * Uses Passport's `req.isAuthenticated()` method.
 */

/**
 * Middleware to ensure a user is authenticated via a session.
 * Checks if `req.isAuthenticated()` returns true.
 * If authenticated, proceeds to the next middleware or route handler.
 * If not authenticated, sends a 401 Unauthorized response.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized: Please log in to access this resource.' });
}

module.exports = { ensureAuthenticated };
