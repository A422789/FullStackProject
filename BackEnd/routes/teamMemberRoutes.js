const express = require('express');
const router = express.Router();
const {
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} = require('../controllers/teamMemberController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get all team members (Private — any logged-in user)
router.get('/', protect, getTeamMembers);

// Add, Edit, Delete team members (Private for Admin only)
router.post('/', protect, authorize('admin'), createTeamMember);
router.put('/:id', protect, authorize('admin'), updateTeamMember);
router.delete('/:id', protect, authorize('admin'), deleteTeamMember);

module.exports = router;
