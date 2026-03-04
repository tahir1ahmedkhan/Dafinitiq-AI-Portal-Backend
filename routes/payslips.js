const express = require('express');
const router = express.Router();
const Payslip = require('../models/Payslip');
const auth = require('../middleware/auth');

// Get all payslips for logged-in employee
router.get('/', auth, async (req, res) => {
  try {
    const payslips = await Payslip.find({ employeeId: req.employee.id }).sort({ createdAt: -1 });
    res.json(payslips);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
