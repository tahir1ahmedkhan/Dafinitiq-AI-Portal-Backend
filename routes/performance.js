const express = require('express');
const router = express.Router();
const Performance = require('../models/Performance');
const auth = require('../middleware/auth');

// Get all performance reviews for logged-in employee
router.get('/', auth, async (req, res) => {
  try {
    const reviews = await Performance.find({ employeeId: req.employee.id }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
