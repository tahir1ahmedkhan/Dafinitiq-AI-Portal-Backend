const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

// Get all expenses for logged-in employee
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ employeeId: req.employee.id }).sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create expense
router.post('/', auth, async (req, res) => {
  try {
    const newExpense = new Expense({
      employeeId: req.employee.id,
      ...req.body
    });
    const expense = await newExpense.save();
    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update expense
router.put('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ msg: 'Expense not found' });
    }
    
    // Check if the expense belongs to the logged-in employee
    if (expense.employeeId.toString() !== req.employee.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    
    res.json(updatedExpense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete expense
router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ msg: 'Expense not found' });
    }
    
    // Check if the expense belongs to the logged-in employee
    if (expense.employeeId.toString() !== req.employee.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    await Expense.findByIdAndDelete(req.params.id);
    
    res.json({ msg: 'Expense deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
