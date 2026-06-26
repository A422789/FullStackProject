const TeamMember = require('../models/TeamMember');

// @desc    Get all team members
// @route   GET /api/team
// @access  Private (Admin only)
exports.getTeamMembers = async (req, res) => {
  try {
    const members = await TeamMember.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create a new team member
// @route   POST /api/team
// @access  Private (Admin only)
exports.createTeamMember = async (req, res) => {
  try {
    const { fullName, role, email, phone, department, skills } = req.body;

    // Handle comma separated skills if it's sent as a string
    let skillsArray = [];
    if (skills) {
      if (Array.isArray(skills)) {
        skillsArray = skills;
      } else if (typeof skills === 'string') {
        skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill !== '');
      }
    }

    const member = await TeamMember.create({
      fullName,
      role,
      email,
      phone,
      department,
      skills: skillsArray,
    });

    res.status(201).json({
      success: true,
      data: member,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update an existing team member
// @route   PUT /api/team/:id
// @access  Private (Admin only)
exports.updateTeamMember = async (req, res) => {
  try {
    const { fullName, role, email, phone, department, skills } = req.body;

    let member = await TeamMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }

    // Handle skills formatting if passed
    let updateFields = { fullName, role, email, phone, department };
    if (skills !== undefined) {
      let skillsArray = [];
      if (Array.isArray(skills)) {
        skillsArray = skills;
      } else if (typeof skills === 'string') {
        skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill !== '');
      }
      updateFields.skills = skillsArray;
    }

    member = await TeamMember.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: member,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete a team member
// @route   DELETE /api/team/:id
// @access  Private (Admin only)
exports.deleteTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }

    await member.deleteOne();

    res.json({
      success: true,
      message: 'Team member deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
