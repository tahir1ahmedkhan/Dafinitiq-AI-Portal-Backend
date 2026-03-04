const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Admin = require('../models/Admin');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    const email = 'admin@dafinitiq.com';
    const password = 'admin123';

    let admin = await Admin.findOne({ email });
    if (admin) {
      console.log('Admin already exists');
      process.exit();
    }

    admin = new Admin({
      fullName: 'Administrator',
      email,
      password
    });

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(password, salt);

    await admin.save();
    console.log('Admin created successfully');
    console.log('Email:', email);
    console.log('Password:', password);
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();
