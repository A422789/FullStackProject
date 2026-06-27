// ========================================================
// Neoteric — Backup Team Members Script
// Dumps current team member collection to a backup JSON file
// Run: node script-testing/dumpTeamMembers.js
// ========================================================

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load env vars
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const TeamMember = require('../models/TeamMember');

const dumpData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    console.log('Fetching team members...');
    const members = await TeamMember.find();
    console.log(`Found ${members.length} team members.`);

    const backupPath = path.join(__dirname, 'team_members_backup.json');
    fs.writeFileSync(backupPath, JSON.stringify(members, null, 2), 'utf-8');
    
    console.log(`\x1b[32m✅ Backup created successfully at:\x1b[0m\n${backupPath}`);
  } catch (error) {
    console.error(`\x1b[31m❌ Error dumping team members: ${error.message}\x1b[0m`);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  }
};

dumpData();
