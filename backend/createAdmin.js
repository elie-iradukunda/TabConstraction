const { sequelize } = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Connect to DB
    await sequelize.authenticate();
    console.log('Database connected...');

    // Define admin details
    const adminData = {
      name: 'System Admin',
      email: 'admin@tabiconst.com',
      password: 'AdminPassword123!',
      role: 'admin',
      phone: '1234567890'
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ where: { email: adminData.email } });
    
    if (existingAdmin) {
      console.log('Admin user already exists. Updating role to admin just in case...');
      existingAdmin.role = 'admin';
      await existingAdmin.save();
    } else {
      // Create new admin
      // Note: The User model has a beforeCreate hook that hashes the password
      await User.create(adminData);
      console.log('Admin user created successfully!');
    }

    console.log('-----------------------------------');
    console.log('Email: ' + adminData.email);
    console.log('Password: ' + adminData.password);
    console.log('Role: admin');
    console.log('-----------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin();
