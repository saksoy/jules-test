const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
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
