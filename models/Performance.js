const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  reviewDate: {
    type: Date,
    default: Date.now
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  comments: String,
  goals: [String],
  achievements: [String]
}, { timestamps: true });

module.exports = mongoose.model('Performance', performanceSchema);
