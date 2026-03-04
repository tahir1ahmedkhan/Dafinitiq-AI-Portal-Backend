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

// Get all incomes
router.get('/incomes', auth, async (req, res) => {
  try {
    const Income = require('../models/Income');
    const incomes = await Income.find().sort({ createdAt: -1 });
    res.json(incomes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create income
router.post('/incomes', auth, async (req, res) => {
  try {
    const Income = require('../models/Income');
    const newIncome = new Income(req.body);
    const income = await newIncome.save();
    res.json(income);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update income
router.put('/incomes/:id', auth, async (req, res) => {
  try {
    const Income = require('../models/Income');
    const income = await Income.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(income);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete income
router.delete('/incomes/:id', auth, async (req, res) => {
  try {
    const Income = require('../models/Income');
    await Income.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Income deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all expenses (admin)
router.get('/expenses', auth, async (req, res) => {
  try {
    const Expense = require('../models/Expense');
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create expense (admin)
router.post('/expenses', auth, async (req, res) => {
  try {
    const Expense = require('../models/Expense');
    
    // Validate required fields
    const { vendor, category, amount, paymentMethod, date } = req.body;
    
    if (!category || !amount) {
      return res.status(400).json({ msg: 'Category and amount are required' });
    }
    
    const newExpense = new Expense({
      vendor: vendor || 'N/A',
      category,
      amount: parseFloat(amount),
      paymentMethod: paymentMethod || 'Cash',
      date: date || new Date(),
      description: req.body.description || '',
      createdBy: 'Admin',
      status: 'Approved'
    });
    
    const expense = await newExpense.save();
    res.json(expense);
  } catch (err) {
    console.error('Error creating expense:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Update expense (admin)
router.put('/expenses/:id', auth, async (req, res) => {
  try {
    const Expense = require('../models/Expense');
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete expense (admin)
router.delete('/expenses/:id', auth, async (req, res) => {
  try {
    const Expense = require('../models/Expense');
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Expense deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all contracts (admin)
router.get('/contracts', auth, async (req, res) => {
  try {
    const Contract = require('../models/Contract');
    const contracts = await Contract.find().sort({ createdAt: -1 });
    res.json(contracts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create contract (admin)
router.post('/contracts', auth, async (req, res) => {
  try {
    const Contract = require('../models/Contract');
    
    // Validate required fields
    const { contractName, clientName, value, startDate } = req.body;
    
    if (!contractName || !clientName || !value || !startDate) {
      return res.status(400).json({ msg: 'Contract name, client name, value, and start date are required' });
    }
    
    const newContract = new Contract({
      contractName,
      clientName,
      value: parseFloat(value),
      paymentSchedule: req.body.paymentSchedule || 'Monthly',
      status: req.body.status || 'Pending',
      startDate,
      endDate: req.body.endDate || null,
      description: req.body.description || ''
    });
    
    const contract = await newContract.save();
    res.json(contract);
  } catch (err) {
    console.error('Error creating contract:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Update contract (admin)
router.put('/contracts/:id', auth, async (req, res) => {
  try {
    const Contract = require('../models/Contract');
    const contract = await Contract.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(contract);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete contract (admin)
router.delete('/contracts/:id', auth, async (req, res) => {
  try {
    const Contract = require('../models/Contract');
    await Contract.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Contract deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all leaves (admin)
router.get('/leaves', auth, async (req, res) => {
  try {
    const Leave = require('../models/Leave');
    const leaves = await Leave.find()
      .populate('employeeId', 'fullName email')
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Approve leave (admin)
router.put('/leaves/:id/approve', auth, async (req, res) => {
  try {
    const Leave = require('../models/Leave');
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: 'Approved' },
      { new: true }
    ).populate('employeeId', 'fullName email');
    res.json(leave);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Reject leave (admin)
router.put('/leaves/:id/reject', auth, async (req, res) => {
  try {
    const Leave = require('../models/Leave');
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: 'Rejected' },
      { new: true }
    ).populate('employeeId', 'fullName email');
    res.json(leave);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Mark leave as unapproved (admin)
router.put('/leaves/:id/unapprove', auth, async (req, res) => {
  try {
    const Leave = require('../models/Leave');
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: 'Pending' },
      { new: true }
    ).populate('employeeId', 'fullName email');
    res.json(leave);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete leave (admin)
router.delete('/leaves/:id', auth, async (req, res) => {
  try {
    const Leave = require('../models/Leave');
    await Leave.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Leave deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
