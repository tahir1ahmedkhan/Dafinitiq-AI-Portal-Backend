const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  recipientType: {
    type: String,
    enum: ['Admin', 'Employee'],
    required: true
  },
  type: {
    type: String,
    enum: ['leave_request', 'leave_approved', 'leave_rejected', 'payslip_generated', 'performance_review', 'expense_submitted', 'new_employee'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId
  },
  relatedModel: {
    type: String,
    enum: ['Leave', 'Payslip', 'Performance', 'Expense', 'Employee']
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
