const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  icon: {
    type: String,
    required: [true, 'Please add an icon class (e.g., fas fa-laptop)'],
    default: 'fas fa-cogs',
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  priceRange: {
    type: String,
    required: [true, 'Please add a price range'],
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Service', ServiceSchema);
