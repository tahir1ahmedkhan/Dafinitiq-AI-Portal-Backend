const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  contractName: {
    type: String,
    required: true
  },
  clientName: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  paymentSchedule: {
    type: String,
    enum: ['Monthly', 'Quarterly', 'One-time', 'Milestone-based'],
    default: 'Monthly'
  },
  status: {
    type: String,
    enum: ['Pending', 'Active', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  description: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Contract', contractSchema);
