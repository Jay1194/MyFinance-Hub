require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./src/config/database');
const plaidRoutes = require('./src/routes/plaidRoutes');
const transactionRoutes = require('./src/routes/transactionRoutes');
const userRoutes = require('./src/routes/userRoutes');
const budgetRoutes = require('./src/routes/budgetRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/plaid', plaidRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/budgets', budgetRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

// Catch-all route for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});