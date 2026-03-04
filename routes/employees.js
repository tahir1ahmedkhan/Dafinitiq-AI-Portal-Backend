const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const auth = require('../middleware/auth');

// Get employee profile
router.get('/profile', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.employee.id).select('-password');
    res.json(employee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update employee profile
router.put('/profile', auth, async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.employee.id,
      { $set: req.body },
      { new: true }
    ).select('-password');
    res.json(employee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
