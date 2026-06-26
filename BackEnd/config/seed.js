const User = require('../models/User');

const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.log('Admin credentials not found in env variables.');
      return;
    }

    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });
      console.log(`Admin user seeded successfully with email: ${adminEmail}`);
    } else {
      console.log('Admin user already exists in database.');
    }
  } catch (error) {
    console.error(`Error seeding admin user: ${error.message}`);
  }
};

module.exports = seedAdmin;
