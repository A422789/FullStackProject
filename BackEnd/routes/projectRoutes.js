const express = require('express');
const router = express.Router();
const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get projects (Private — any logged-in user)
router.get('/', protect, getProjects);

// Add, Edit, Delete projects (Private for Admin only)
router.post('/', protect, authorize('admin'), createProject);
router.put('/:id', protect, authorize('admin'), updateProject);
router.delete('/:id', protect, authorize('admin'), deleteProject);

module.exports = router;
