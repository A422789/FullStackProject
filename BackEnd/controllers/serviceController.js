const Service = require('../models/Service');

// @desc    Get all services
// @route   GET /api/services
// @access  Public (Visitors need to read them)
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create a new service
// @route   POST /api/services
// @access  Private (Admin only)
exports.createService = async (req, res) => {
  try {
    const { title, description, icon, status, priceRange, category } = req.body;

    const service = await Service.create({
      title,
      description,
      icon,
      status,
      priceRange,
      category,
    });

    res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update an existing service
// @route   PUT /api/services/:id
// @access  Private (Admin only)
exports.updateService = async (req, res) => {
  try {
    const { title, description, icon, status, priceRange, category } = req.body;

    let service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    service = await Service.findByIdAndUpdate(
      req.params.id,
      { title, description, icon, status, priceRange, category },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: service,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private (Admin only)
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    await service.deleteOne();

    res.json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
