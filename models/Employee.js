const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  mobileNumber: String,
  cnic: String,
  profileImage: String,
  position: {
    type: String,
    default: 'Full-Stack Intern'
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  employmentType: {
    type: String,
    enum: ['Full Time', 'Part Time', 'Contract'],
    default: 'Full Time'
  },
  workMode: {
    type: String,
    enum: ['Onsite', 'Remote', 'Hybrid'],
    default: 'Onsite'
  },
  probation: {
    type: Number,
    default: 0
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  baseSalary: {
    type: Number,
    default: 10000
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phoneNumber: String
  },
  bankDetails: {
    bankName: String,
    accountTitle: String,
    iban: String
  },
  contractFile: String
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
