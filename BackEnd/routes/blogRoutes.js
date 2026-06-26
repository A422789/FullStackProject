const express = require('express');
const router = express.Router();
const {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get all blog posts (Private — any logged-in user)
router.get('/', protect, getBlogs);

// Add, Edit, Delete blog posts (Private for Admin only)
router.post('/', protect, authorize('admin'), createBlog);
router.put('/:id', protect, authorize('admin'), updateBlog);
router.delete('/:id', protect, authorize('admin'), deleteBlog);

module.exports = router;
