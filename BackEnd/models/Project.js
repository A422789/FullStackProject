const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
  },
  deadline: {
    type: String,
    required: [true, 'Please add a deadline'],
  },
  clientName: {
    type: String,
    required: [true, 'Please add a client name'],
  },
  status: {
    type: String,
    enum: ['Active', 'Completed', 'On Hold'],
    default: 'Active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Project', ProjectSchema);
