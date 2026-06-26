const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  // Singleton identifier — always one document
  _singleton: {
    type: String,
    default: 'site_settings',
    unique: true,
  },

  general: {
    logo: {
      type: String,
      default: '',
    },
    siteName: {
      type: String,
      default: 'Neoteric Technologies',
      trim: true,
    },
    tagline: {
      type: String,
      default: 'Creative Solutions for Modern Businesses',
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    language: {
      type: String,
      enum: ['English', 'Arabic', 'French'],
      default: 'English',
    },
    timezone: {
      type: String,
      default: 'Asia/Jerusalem',
    },
    features: {
      maintenanceMode: {
        type: Boolean,
        default: false,
      },
      allowComments: {
        type: Boolean,
        default: true,
      },
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      analyticsTracking: {
        type: Boolean,
        default: true,
      },
    },
  },

  contact: {
    email: {
      type: String,
      default: 'hello@neoteric.tech',
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    address: {
      type: String,
      default: '',
      trim: true,
    },
    businessHours: {
      type: String,
      default: 'Sun–Thu, 9AM–5PM',
      trim: true,
    },
    supportEmail: {
      type: String,
      default: 'support@neoteric.tech',
      trim: true,
      lowercase: true,
    },
  },

  social: {
    facebook: {
      type: String,
      default: '',
      trim: true,
    },
    twitter: {
      type: String,
      default: '',
      trim: true,
    },
    linkedin: {
      type: String,
      default: '',
      trim: true,
    },
    instagram: {
      type: String,
      default: '',
      trim: true,
    },
  },

  seo: {
    metaTitle: {
      type: String,
      default: 'Neoteric Technologies – Creative Design & Development',
      trim: true,
    },
    metaDescription: {
      type: String,
      default: '',
    },
    metaKeywords: {
      type: String,
      default: '',
      trim: true,
    },
    googleAnalyticsId: {
      type: String,
      default: '',
      trim: true,
    },
    robots: {
      type: String,
      enum: ['index, follow', 'noindex, nofollow', 'index, nofollow'],
      default: 'index, follow',
    },
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Settings', SettingsSchema);
