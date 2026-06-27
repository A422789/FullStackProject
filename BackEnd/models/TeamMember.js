const mongoose = require('mongoose');

const TeamMemberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please link a user account'],
  },
  fullName: {
    type: String,
    required: [true, 'Please add a full name'],
    trim: true,
  },
  role: {
    type: String,
    required: [true, 'Please add a role/job title'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    trim: true,
  },
  department: {
    type: String,
    required: [true, 'Please add a department'],
    trim: true,
  },
  skills: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('TeamMember', TeamMemberSchema);
