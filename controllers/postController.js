const { readData, writeData } = require('../utils/fileUtils');
const { validationResult } = require('express-validator');

const postsFilePath = './data/posts.json';

/**
 * Handles creating a new post after validating title and content.
 * User ID is attached from the authentication middleware.
 * @param {object} req - Express request object. Expected body: { title, content }. User from `req.user`.
 * @param {object} res - Express response object.
 */
function createPost(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, content } = req.body;
    const userId = req.user.id; // Assuming protect middleware attaches user with id

    const posts = readData(postsFilePath);
    const newPost = {
      id: Date.now().toString(),
      title,
      content,
      userId,
      createdAt: new Date().toISOString(),
    };

    posts.push(newPost);
    writeData(postsFilePath, posts);
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error in createPost:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error creating post.' });
    }
  }
}

/**
 * Handles retrieving all posts.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
function getAllPosts(req, res) {
  try {
    const posts = readData(postsFilePath);
    res.status(200).json(posts);
  } catch (error)
 {
    console.error('Error in getAllPosts:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error retrieving posts.' });
    }
  }
}

/**
 * Handles retrieving a single post by its ID.
 * @param {object} req - Express request object. `req.params.id` contains the post ID.
 * @param {object} res - Express response object.
 */
function getPostById(req, res) {
  try {
    const { id } = req.params;
    const posts = readData(postsFilePath);
    const post = posts.find(p => p.id === id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error('Error in getPostById:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error retrieving post.' });
    }
  }
}

/**
 * Handles updating an existing post by its ID after validating title and content.
 * Ensures that the user updating the post is the one who created it.
 * @param {object} req - Express request object. `req.params.id` contains post ID. Expected body: { title, content }. User from `req.user`.
 * @param {object} res - Express response object.
 */
function updatePost(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id: postId } = req.params;
    const { title, content } = req.body;
    const userId = req.user.id;

    let posts = readData(postsFilePath);
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex === -1) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    if (posts[postIndex].userId !== userId) {
      return res.status(403).json({ message: 'User not authorized to update this post.' });
    }

    posts[postIndex] = {
      ...posts[postIndex],
      title,
      content,
      updatedAt: new Date().toISOString(),
    };

    writeData(postsFilePath, posts);
    res.status(200).json(posts[postIndex]);
  } catch (error) {
    console.error('Error in updatePost:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error updating post.' });
    }
  }
}

/**
 * Handles deleting a post by its ID.
 * Ensures that the user deleting the post is the one who created it.
 * @param {object} req - Express request object. `req.params.id` contains post ID. User from `req.user`.
 * @param {object} res - Express response object.
 */
function deletePost(req, res) {
  try {
    const { id: postId } = req.params;
    const userId = req.user.id;

    let posts = readData(postsFilePath);
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex === -1) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    if (posts[postIndex].userId !== userId) {
      return res.status(403).json({ message: 'User not authorized to delete this post.' });
    }

    posts = posts.filter(p => p.id !== postId);
    writeData(postsFilePath, posts);
    res.status(200).json({ message: 'Post removed successfully.' });
  } catch (error) {
    console.error('Error in deletePost:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error deleting post.' });
    }
  }
}

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};
