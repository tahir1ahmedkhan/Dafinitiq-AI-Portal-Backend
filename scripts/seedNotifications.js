const mongoose = require('mongoose');
require('dotenv').config();

const Notification = require('../models/Notification');
const Admin = require('../models/Admin');
const Employee = require('../models/Employee');

const seedNotifications = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Get first admin and employee
    const admin = await Admin.findOne();
    const employee = await Employee.findOne();

    if (!admin) {
      console.log('No admin found. Please create an admin first.');
      process.exit(1);
    }

    if (!employee) {
      console.log('No employee found. Please create an employee first.');
      process.exit(1);
    }

    // Clear existing notifications
    await Notification.deleteMany({});
    console.log('Cleared existing notifications');

    // Sample notifications for admin
    const adminNotifications = [
      {
        recipientId: admin._id,
        recipientType: 'Admin',
        type: 'leave_request',
        title: 'New Leave Request',
        message: `${employee.fullName} has submitted a Sick Leave request from ${new Date().toLocaleDateString()} to ${new Date(Date.now() + 86400000 * 3).toLocaleDateString()}`,
        relatedId: employee._id,
        relatedModel: 'Leave',
        isRead: false
      },
      {
        recipientId: admin._id,
        recipientType: 'Admin',
        type: 'leave_request',
        title: 'New Leave Request',
        message: `${employee.fullName} has submitted an Annual Leave request`,
        relatedId: employee._id,
        relatedModel: 'Leave',
        isRead: false
      },
      {
        recipientId: admin._id,
        recipientType: 'Admin',
        type: 'new_employee',
        title: 'New Employee Registered',
        message: `A new employee ${employee.fullName} has registered in the system`,
        relatedId: employee._id,
        relatedModel: 'Employee',
        isRead: true
      }
    ];

    // Sample notifications for employee
    const employeeNotifications = [
      {
        recipientId: employee._id,
        recipientType: 'Employee',
        type: 'leave_approved',
        title: 'Leave Request Approved',
        message: 'Your Sick Leave request from ' + new Date().toLocaleDateString() + ' has been approved',
        relatedId: employee._id,
        relatedModel: 'Leave',
        isRead: false
      },
      {
        recipientId: employee._id,
        recipientType: 'Employee',
        type: 'payslip_generated',
        title: 'New Payslip Generated',
        message: `Your payslip for ${new Date().toLocaleString('default', { month: 'long' })} ${new Date().getFullYear()} has been generated`,
        relatedId: employee._id,
        relatedModel: 'Payslip',
        isRead: false
      },
      {
        recipientId: employee._id,
        recipientType: 'Employee',
        type: 'performance_review',
        title: 'New Performance Review',
        message: 'A new performance review has been added for you with a rating of 4/5',
        relatedId: employee._id,
        relatedModel: 'Performance',
        isRead: true
      }
    ];

    // Insert notifications
    await Notification.insertMany([...adminNotifications, ...employeeNotifications]);
    
    console.log('✅ Sample notifications created successfully!');
    console.log(`Created ${adminNotifications.length} notifications for admin`);
    console.log(`Created ${employeeNotifications.length} notifications for employee`);
    
    process.exit(0);
  } catch (err) {
    console.error('Error seeding notifications:', err);
    process.exit(1);
  }
};

seedNotifications();
