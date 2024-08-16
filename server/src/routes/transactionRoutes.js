const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

router.get('/', authenticateToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Add a new transaction
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

    // Update the corresponding budget's spent amount
    await Budget.findOneAndUpdate(
      { 
        userId: req.user.id, 
        category: transaction.category,
        startDate: { $lte: transaction.date },
        endDate: { $gte: transaction.date }
      },
      { $inc: { spent: transaction.amount } },
      { new: true }
    );

    res.status(201).json({ message: 'Transaction added successfully', transaction });
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ error: 'Failed to add transaction' });
  }
});



module.exports = router;