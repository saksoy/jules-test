const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session'); // Import express-session
const passport = require('passport'); // Import passport
require('./config/passport-setup'); // This line executes the passport configurations
const { errorHandler } = require('./middleware/errorMiddleware');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

// Initialize express app
const app = express();

// Apply Helmet middleware to enhance security by setting various HTTP headers.
// It helps protect against common web vulnerabilities like XSS, clickjacking, etc.
app.use(helmet());

// Enable CORS (Cross-Origin Resource Sharing) for all origins.
// For production, configure specific origins: app.use(cors({ origin: 'http://yourfrontenddomain.com' }));
app.use(cors());

// Middleware to parse JSON bodies - should be before routes
app.use(express.json());

// Session middleware setup.
// This must be configured before Passport initialization and any routes that depend on sessions.
// 'secret' should be a long, random string stored in an environment variable for production.
// 'resave: false' prevents session from being saved back to the session store if it wasn't modified.
// 'saveUninitialized: false' prevents a session from being stored if it's new and not modified.
// 'cookie.secure: true' in production ensures cookies are only sent over HTTPS.
app.use(
  session({
    secret: 'your_very_secret_key_for_session', // Replace with env variable in production
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // True if NODE_ENV is 'production'
      httpOnly: true, // Helps prevent XSS attacks
      // maxAge: 1000 * 60 * 60 * 24 // Optional: e.g., 1 day
    },
  })
);

// Initialize Passport and restore authentication state, if any, from the session.
// These must be after the session middleware.
app.use(passport.initialize());
app.use(passport.session());

// Mount routers
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Global error handler - should be the last middleware
app.use(errorHandler);

// Define a port and start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // For potential testing or programmatic use
