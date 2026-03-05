const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');
const Employee = require('../models/Employee');
const Admin = require('../models/Admin');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// Get all leaves for logged-in employee
router.get('/', auth, async (req, res) => {
  try {
    const leaves = await Leave.find({ employeeId: req.employee.id }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create leave request
router.post('/', auth, async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason, emergencyContact } = req.body;
    
    // Validate required fields
    if (!leaveType || !startDate || !endDate) {
      return res.status(400).json({ msg: 'Leave type, start date, and end date are required' });
    }
    
    const newLeave = new Leave({
      employeeId: req.employee.id,
      leaveType,
      startDate,
      endDate,
      reason: reason || '',
      emergencyContact: emergencyContact || '',
      status: 'Pending'
    });
    
    const leave = await newLeave.save();
    
    // Get employee details
    const employee = await Employee.findById(req.employee.id);
    
    // Create notification for all admins
    const admins = await Admin.find();
    for (const admin of admins) {
      await new Notification({
        recipientId: admin._id,
        recipientType: 'Admin',
        type: 'leave_request',
        title: 'New Leave Request',
        message: `${employee.fullName} has submitted a ${leaveType} request from ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`,
        relatedId: leave._id,
        relatedModel: 'Leave'
      }).save();
    }
    
    res.json(leave);
  } catch (err) {
    console.error('Error creating leave:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Approve leave
router.put('/:id/approve', auth, async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: 'Approved' },
      { new: true }
    );
    res.json(leave);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Reject leave
router.put('/:id/reject', auth, async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: 'Rejected' },
      { new: true }
    );
    res.json(leave);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Mark as unapproved
router.put('/:id/unapprove', auth, async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: 'Pending' },
      { new: true }
    );
    res.json(leave);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete leave
router.delete('/:id', auth, async (req, res) => {
  try {
    await Leave.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Leave deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
