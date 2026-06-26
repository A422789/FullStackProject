const Project = require('../models/Project');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private (Admin only)
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (Admin only)
exports.createProject = async (req, res) => {
  try {
    const { title, description, category, deadline, clientName, status } = req.body;

    const project = await Project.create({
      title,
      description,
      category,
      deadline,
      clientName,
      status,
    });

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update an existing project
// @route   PUT /api/projects/:id
// @access  Private (Admin only)
exports.updateProject = async (req, res) => {
  try {
    const { title, description, category, deadline, clientName, status } = req.body;

    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    project = await Project.findByIdAndUpdate(
      req.params.id,
      { title, description, category, deadline, clientName, status },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (Admin only)
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    await project.deleteOne();

    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
