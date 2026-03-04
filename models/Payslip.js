const mongoose = require('mongoose');

const payslipSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  month: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  baseSalary: Number,
  allowances: Number,
  deductions: Number,
  netSalary: Number,
  status: {
    type: String,
    enum: ['Pending', 'Paid'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Payslip', payslipSchema);
