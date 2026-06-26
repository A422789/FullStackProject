const express = require('express');
const router = express.Router();
const {
  getServices,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get services (Private — any logged-in user)
router.get('/', protect, getServices);

// Add, Edit, Delete services (Private for Admin only)
router.post('/', protect, authorize('admin'), createService);
router.put('/:id', protect, authorize('admin'), updateService);
router.delete('/:id', protect, authorize('admin'), deleteService);

module.exports = router;
