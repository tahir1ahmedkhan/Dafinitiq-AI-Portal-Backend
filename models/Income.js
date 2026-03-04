const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true
  },
  projectName: {
    type: String,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 0
  },
  paidAmount: {
    type: Number,
    required: true,
    default: 0
  },
  outstandingAmount: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  },
  paymentType: {
    type: String,
    enum: ['Full Payment', 'Partial Payment', 'Milestone'],
    default: 'Full Payment'
  },
  status: {
    type: String,
    enum: ['Paid', 'Pending', 'Overdue'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Income', IncomeSchema);
