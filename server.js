const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/payslips', require('./routes/payslips'));
app.use('/api/leaves', require('./routes/leaves'));
app.use('/api/performance', require('./routes/performance'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/notifications', require('./routes/notifications'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
