// ========================================================
// Neoteric — Migrate Team Members Script
// Restores team members with the new user authentication design
// Run: node script-testing/migrateTeamMembers.js
// ========================================================

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load env vars
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const TeamMember = require('../models/TeamMember');
const User = require('../models/User');

const migrateData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    const backupPath = path.join(__dirname, 'team_members_backup.json');
    if (!fs.existsSync(backupPath)) {
      throw new Error(`Backup file not found at: ${backupPath}`);
    }

    const rawData = fs.readFileSync(backupPath, 'utf-8');
    const oldMembers = JSON.parse(rawData);
    console.log(`Loaded ${oldMembers.length} team members from backup.`);

    // Clear existing team members to avoid validation issues with missing `user` field
    console.log('Clearing existing team members collection...');
    await TeamMember.deleteMany({});
    console.log('Cleared team members.');

    const defaultPassword = 'MemberTempPass2026!';
    const migratedMembers = [];

    for (const member of oldMembers) {
      console.log(`\nProcessing member: ${member.fullName} (${member.email})`);

      // Check if user already exists
      let user = await User.findOne({ email: member.email.toLowerCase() });

      if (!user) {
        console.log(`Creating user account for ${member.fullName}...`);
        user = await User.create({
          name: member.fullName,
          email: member.email.toLowerCase(),
          password: defaultPassword,
          role: member.email.toLowerCase() === (process.env.ADMIN_EMAIL || '').toLowerCase() ? 'admin' : 'member'
        });
        console.log(`User created with ID: ${user._id}`);
      } else {
        console.log(`User account already exists for ${member.fullName} with ID: ${user._id}`);
      }

      // Create new team member with user reference
      const newMember = {
        user: user._id,
        fullName: member.fullName,
        role: member.role,
        email: member.email,
        phone: member.phone,
        department: member.department,
        skills: member.skills || [],
        createdAt: member.createdAt || new Date()
      };

      migratedMembers.push(newMember);
    }

    console.log('\nInserting migrated team members into MongoDB...');
    const result = await TeamMember.insertMany(migratedMembers);
    console.log(`\x1b[32m✅ Successfully migrated ${result.length} team members!\x1b[0m`);

  } catch (error) {
    console.error(`\x1b[31m❌ Migration failed: ${error.message}\x1b[0m`);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  }
};

migrateData();
