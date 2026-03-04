const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: false
  },
  vendor: {
    type: String,
    required: false
  },
  category: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: String,
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Debit Card', 'Credit Card', 'Bank Transfer', 'Check'],
    default: 'Cash'
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Approved'
  },
  createdBy: {
    type: String,
    default: 'Employee'
  },
  receipt: String
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
