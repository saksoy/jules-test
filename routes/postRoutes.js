const express = require('express');
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} = require('../controllers/postController');
// Updated to use the new session-based authentication middleware
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const { body } = require('express-validator');

/**
 * @fileoverview Post routes for creating, reading, updating, and deleting posts.
 * All routes are protected and require session-based authentication.
 */

/**
 * Route to create a new post.
 * Requires session authentication. Validates title and content.
 * @name POST /
 * @function
 * @memberof module:routes/postRoutes
 * @inner
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
router.post(
  '/',
  ensureAuthenticated, // Use the new middleware
  [
    body('title').notEmpty().withMessage('Title is required.'),
    body('content').notEmpty().withMessage('Content is required.'),
  ],
  createPost
);

/**
 * Route to list all posts.
 * Requires session authentication.
 * @name GET /
 * @function
 * @memberof module:routes/postRoutes
 * @inner
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
router.get('/', ensureAuthenticated, getAllPosts); // Use the new middleware

/**
 * Route to get a single post by its ID.
 * Requires session authentication.
 * @name GET /:id
 * @function
 * @memberof module:routes/postRoutes
 * @inner
 * @param {object} req - Express request object, params.id contains the post ID.
 * @param {object} res - Express response object.
 */
router.get('/:id', ensureAuthenticated, getPostById); // Use the new middleware

/**
 * Route to update an existing post by its ID.
 * Requires session authentication. Validates title and content.
 * @name PUT /:id
 * @function
 * @memberof module:routes/postRoutes
 * @inner
 * @param {object} req - Express request object, params.id contains the post ID.
 * @param {object} res - Express response object.
 */
router.put(
  '/:id',
  ensureAuthenticated, // Use the new middleware
  [
    body('title').notEmpty().withMessage('Title is required.'),
    body('content').notEmpty().withMessage('Content is required.'),
  ],
  updatePost
);

/**
 * Route to delete a post by its ID.
 * Requires session authentication.
 * @name DELETE /:id
 * @function
 * @memberof module:routes/postRoutes
 * @inner
 * @param {object} req - Express request object, params.id contains the post ID.
 * @param {object} res - Express response object.
 */
router.delete('/:id', ensureAuthenticated, deletePost); // Use the new middleware

module.exports = router;
