const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const Transaction = require('../models/Transaction');

router.get('/', authenticateToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const transaction = new Transaction({
      userId: req.user.id,
      amount: req.body.amount,
      category: req.body.category,
      date: req.body.date,
      description: req.body.description,
    });
    await transaction.save();
    res.status(201).json({ message: 'Transaction added successfully', transaction });
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ error: 'Failed to add transaction' });
  }
});

module.exports = router;