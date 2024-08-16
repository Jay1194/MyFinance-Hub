const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const Transaction = require('../models/Transaction');

// Get expenses by category
router.get('/expenses-by-category', authenticateToken, async (req, res) => {
  try {
    const expenses = await Transaction.aggregate([
      { $match: { userId: req.user.id, amount: { $lt: 0 } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $project: { category: '$_id', total: { $abs: '$total' }, _id: 0 } }
    ]);
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expenses by category' });
  }
});

router.get('/spending-by-category', authenticateToken, async (req, res) => {
  try {
    const expenses = await Transaction.aggregate([
      { $match: { userId: req.user.id, amount: { $lt: 0 } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $project: { category: '$_id', total: { $abs: '$total' }, _id: 0 } }
    ]);
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch spending by category' });
  }
});

// Get monthly spending
router.get('/monthly-spending', authenticateToken, async (req, res) => {
  try {
    const spending = await Transaction.aggregate([
      { $match: { userId: req.user.id, amount: { $lt: 0 } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
          total: { $sum: '$amount' }
        }
      },
      { $project: { month: '$_id', total: { $abs: '$total' }, _id: 0 } },
      { $sort: { month: 1 } }
    ]);
    res.json(spending);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch monthly spending' });
  }
});

module.exports = router;