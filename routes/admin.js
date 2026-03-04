const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Employee = require('../models/Employee');
const auth = require('../middleware/auth');

// Admin login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const payload = { admin: { id: admin.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, role: 'admin' });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all employees
router.get('/employees', auth, async (req, res) => {
  try {
    const employees = await Employee.find().select('-password').sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get single employee
router.get('/employees/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).select('-password');
    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }
    res.json(employee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create employee
router.post('/employees', auth, async (req, res) => {
  try {
    const { email, password, ...otherData } = req.body;
    let employee = await Employee.findOne({ email });
    if (employee) {
      return res.status(400).json({ msg: 'Employee already exists' });
    }
    employee = new Employee({ email, password, ...otherData });
    const salt = await bcrypt.genSalt(10);
    employee.password = await bcrypt.hash(password, salt);
    await employee.save();
    res.json(employee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update employee
router.put('/employees/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).select('-password');
    res.json(employee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete employee
router.delete('/employees/:id', auth, async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Employee deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all payslips
router.get('/payslips', auth, async (req, res) => {
  try {
    const Payslip = require('../models/Payslip');
    const payslips = await Payslip.find().populate('employeeId', 'fullName email').sort({ createdAt: -1 });
    res.json(payslips);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create payslip
router.post('/payslips', auth, async (req, res) => {
  try {
    const Payslip = require('../models/Payslip');
    const newPayslip = new Payslip(req.body);
    const payslip = await newPayslip.save();
    res.json(payslip);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update payslip
router.put('/payslips/:id', auth, async (req, res) => {
  try {
    const Payslip = require('../models/Payslip');
    const payslip = await Payslip.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(payslip);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all performance reviews
router.get('/performance', auth, async (req, res) => {
  try {
    const Performance = require('../models/Performance');
    const reviews = await Performance.find().populate('employeeId', 'fullName email position').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create performance review
router.post('/performance', auth, async (req, res) => {
  try {
    const Performance = require('../models/Performance');
    const newReview = new Performance(req.body);
    const review = await newReview.save();
    res.json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update performance review
router.put('/performance/:id', auth, async (req, res) => {
  try {
    const Performance = require('../models/Performance');
    const review = await Performance.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete performance review
router.delete('/performance/:id', auth, async (req, res) => {
  try {
    const Performance = require('../models/Performance');
    await Performance.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Performance review deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
