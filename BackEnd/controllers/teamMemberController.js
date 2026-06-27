const TeamMember = require('../models/TeamMember');
const User = require('../models/User');

// @desc    Get all team members
// @route   GET /api/team
// @access  Private (Admin only)
exports.getTeamMembers = async (req, res) => {
  try {
    const members = await TeamMember.find().populate('user', 'role').sort({ createdAt: -1 });
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
  let createdUser = null;
  let isNewUser = false;
  try {
    const { fullName, role, email, phone, department, skills, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Create user account for the team member
      const defaultPassword = password || 'MemberTempPass2026!';
      user = await User.create({
        name: fullName,
        email: email.toLowerCase(),
        password: defaultPassword,
        role: 'member', // Default role for team members
      });
      createdUser = user;
      isNewUser = true;
    }

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
      user: user._id,
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
    // If team member creation failed and we created a user, roll back user creation
    if (isNewUser && createdUser) {
      await User.findByIdAndDelete(createdUser._id);
    }
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

    // Update the associated User document if email or name changed
    if (member.user) {
      const userUpdate = {};
      if (fullName) userUpdate.name = fullName;
      if (email) userUpdate.email = email.toLowerCase();

      if (Object.keys(userUpdate).length > 0) {
        await User.findByIdAndUpdate(member.user, userUpdate);
      }
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

    // Delete associated user
    if (member.user) {
      await User.findByIdAndDelete(member.user);
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
