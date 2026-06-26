const Settings = require('../models/Settings');

// Helper — gets the singleton document, creates it with defaults if it doesn't exist
const getOrCreateSettings = async () => {
  let settings = await Settings.findOne({ _singleton: 'site_settings' });
  if (!settings) {
    settings = await Settings.create({ _singleton: 'site_settings' });
  }
  return settings;
};

// @desc    Get all settings
// @route   GET /api/settings
// @access  Private (Admin only)
exports.getSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update all settings at once
// @route   PUT /api/settings
// @access  Private (Admin only)
exports.updateSettings = async (req, res) => {
  try {
    const { general, contact, social, seo } = req.body;

    const settings = await Settings.findOneAndUpdate(
      { _singleton: 'site_settings' },
      { general, contact, social, seo, updatedAt: Date.now() },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update General settings only
// @route   PATCH /api/settings/general
// @access  Private (Admin only)
exports.updateGeneral = async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      { _singleton: 'site_settings' },
      { general: req.body, updatedAt: Date.now() },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({
      success: true,
      data: settings.general,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update Contact settings only
// @route   PATCH /api/settings/contact
// @access  Private (Admin only)
exports.updateContact = async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      { _singleton: 'site_settings' },
      { contact: req.body, updatedAt: Date.now() },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({
      success: true,
      data: settings.contact,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update Social Media settings only
// @route   PATCH /api/settings/social
// @access  Private (Admin only)
exports.updateSocial = async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      { _singleton: 'site_settings' },
      { social: req.body, updatedAt: Date.now() },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({
      success: true,
      data: settings.social,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update SEO settings only
// @route   PATCH /api/settings/seo
// @access  Private (Admin only)
exports.updateSeo = async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      { _singleton: 'site_settings' },
      { seo: req.body, updatedAt: Date.now() },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({
      success: true,
      data: settings.seo,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
