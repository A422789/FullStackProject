// ==========================================
// Neoteric — Database Seed Script
// Uploads all static data to MongoDB
// Run: node script-testing/runSeed.js
// ==========================================

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars from BackEnd root
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Import Models
const Service = require('../models/Service');
const Project = require('../models/Project');
const TeamMember = require('../models/TeamMember');
const Blog = require('../models/Blog');
const Settings = require('../models/Settings');

// Import Seed Data
const { services, projects, teamMembers, blogs, settings } = require('./seedData');

// ==========================================
// Color helpers for console output
// ==========================================
const green = (text) => `\x1b[32m${text}\x1b[0m`;
const red = (text) => `\x1b[31m${text}\x1b[0m`;
const yellow = (text) => `\x1b[33m${text}\x1b[0m`;
const cyan = (text) => `\x1b[36m${text}\x1b[0m`;

// ==========================================
// Seed Functions
// ==========================================

const seedServices = async () => {
  const count = await Service.countDocuments();
  if (count > 0) {
    console.log(yellow('⚠  Services collection already has data — skipping.'));
    return 0;
  }
  const result = await Service.insertMany(services);
  console.log(green(`✅ Services seeded: ${result.length} documents`));
  return result.length;
};

const seedProjects = async () => {
  const count = await Project.countDocuments();
  if (count > 0) {
    console.log(yellow('⚠  Projects collection already has data — skipping.'));
    return 0;
  }
  const result = await Project.insertMany(projects);
  console.log(green(`✅ Projects seeded: ${result.length} documents`));
  return result.length;
};

const seedTeamMembers = async () => {
  const count = await TeamMember.countDocuments();
  if (count > 0) {
    console.log(yellow('⚠  TeamMembers collection already has data — skipping.'));
    return 0;
  }
  const result = await TeamMember.insertMany(teamMembers);
  console.log(green(`✅ Team Members seeded: ${result.length} documents`));
  return result.length;
};

const seedBlogs = async () => {
  const count = await Blog.countDocuments();
  if (count > 0) {
    console.log(yellow('⚠  Blogs collection already has data — skipping.'));
    return 0;
  }
  const result = await Blog.insertMany(blogs);
  console.log(green(`✅ Blog Posts seeded: ${result.length} documents`));
  return result.length;
};

const seedSettings = async () => {
  const existing = await Settings.findOne({ _singleton: 'site_settings' });
  if (existing) {
    console.log(yellow('⚠  Settings document already exists — skipping.'));
    return 0;
  }
  await Settings.create(settings);
  console.log(green('✅ Settings seeded: 1 document'));
  return 1;
};

// ==========================================
// Main Runner
// ==========================================

const runSeed = async () => {
  try {
    console.log(cyan('\n🚀 Neoteric Database Seeder'));
    console.log(cyan('================================\n'));

    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log(green('✅ Connected to MongoDB\n'));

    // Run all seed functions
    let total = 0;

    total += await seedServices();
    total += await seedProjects();
    total += await seedTeamMembers();
    total += await seedBlogs();
    total += await seedSettings();

    console.log(cyan(`\n================================`));
    console.log(green(`✅ Seeding complete! Total: ${total} documents inserted.`));
    console.log(cyan('================================\n'));

  } catch (error) {
    console.error(red(`\n❌ Seeding failed: ${error.message}`));
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  }
};

runSeed();
