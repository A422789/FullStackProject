const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a post title'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['published', 'draft', 'archived'],
    default: 'draft',
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  views: {
    type: Number,
    default: 0,
  },
  author: {
    type: String,
    required: [true, 'Please add an author name'],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Blog', BlogSchema);
