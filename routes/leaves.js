const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');
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
    const newLeave = new Leave({
      employeeId: req.employee.id,
      ...req.body
    });
    const leave = await newLeave.save();
    res.json(leave);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
