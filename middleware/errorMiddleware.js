/**
 * @fileoverview Error handling middleware.
 */

/**
 * Generic error handler for Express applications.
 * Logs the error and sends a JSON response with error details.
 * Stack trace is included in development environment only.
 * @param {Error} err - The error object.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
function errorHandler(err, req, res, next) {
  console.error(err.stack); // Log error stack for debugging

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    message: err.message,
    // Include stack trace in development only for security reasons
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
}

module.exports = { errorHandler };
