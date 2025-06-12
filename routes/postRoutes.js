const express = require('express');
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const { body } = require('express-validator');

/**
 * @fileoverview Post routes for creating, reading, updating, and deleting posts.
 * All routes are protected and require authentication.
 */

/**
 * Route to create a new post.
 * Requires authentication. Validates title and content.
 * @name POST /
 * @function
 * @memberof module:routes/postRoutes
 * @inner
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
router.post(
  '/',
  protect,
  [
    body('title').notEmpty().withMessage('Title is required.'),
    body('content').notEmpty().withMessage('Content is required.'),
  ],
  createPost
);

/**
 * Route to list all posts.
 * Requires authentication.
 * @name GET /
 * @function
 * @memberof module:routes/postRoutes
 * @inner
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
router.get('/', protect, getAllPosts);

/**
 * Route to get a single post by its ID.
 * Requires authentication.
 * @name GET /:id
 * @function
 * @memberof module:routes/postRoutes
 * @inner
 * @param {object} req - Express request object, params.id contains the post ID.
 * @param {object} res - Express response object.
 */
router.get('/:id', protect, getPostById);

/**
 * Route to update an existing post by its ID.
 * Requires authentication. Validates title and content.
 * @name PUT /:id
 * @function
 * @memberof module:routes/postRoutes
 * @inner
 * @param {object} req - Express request object, params.id contains the post ID.
 * @param {object} res - Express response object.
 */
router.put(
  '/:id',
  protect,
  [
    body('title').notEmpty().withMessage('Title is required.'),
    body('content').notEmpty().withMessage('Content is required.'),
  ],
  updatePost
);

/**
 * Route to delete a post by its ID.
 * Requires authentication.
 * @name DELETE /:id
 * @function
 * @memberof module:routes/postRoutes
 * @inner
 * @param {object} req - Express request object, params.id contains the post ID.
 * @param {object} res - Express response object.
 */
router.delete('/:id', protect, deletePost);

module.exports = router;
