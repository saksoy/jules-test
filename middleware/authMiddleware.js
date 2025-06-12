const jwt = require('jsonwebtoken');

// In a real app, this would come from a shared config or environment variable
const JWT_SECRET = 'your_jwt_secret';

/**
 * Middleware to protect routes by verifying a JWT token.
 * Expects a token in the 'Authorization' header in the format 'Bearer TOKEN'.
 * If the token is valid, attaches the decoded user payload to `req.user`.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
function protect(req, res, next) {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided in Bearer token' });
      }

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Attach user to request object
      // In a real app, you might want to fetch the user from the database here
      // to ensure they still exist and are active.
      req.user = decoded;

      next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Not authorized, token malformed or invalid' });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Not authorized, token expired' });
      }
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token or token not Bearer type' });
  }
}

module.exports = { protect };
