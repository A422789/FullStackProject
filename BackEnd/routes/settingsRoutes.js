const express = require('express');
const router = express.Router();
const {
  getSettings,
  updateSettings,
  updateGeneral,
  updateContact,
  updateSocial,
  updateSeo,
} = require('../controllers/settingsController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get all settings (Private — any logged-in user can view)
router.get('/', protect, getSettings);

// Update all settings at once (Private - Admin only)
router.put('/', protect, authorize('admin'), updateSettings);

// Update individual sections (Private - Admin only)
router.patch('/general', protect, authorize('admin'), updateGeneral);
router.patch('/contact', protect, authorize('admin'), updateContact);
router.patch('/social', protect, authorize('admin'), updateSocial);
router.patch('/seo', protect, authorize('admin'), updateSeo);

module.exports = router;
