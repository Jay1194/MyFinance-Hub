const Transaction = require('../models/Transaction');

async function getSpendingByCategory(userId) {
  return Transaction.aggregate([
    { $match: { userId: userId } },
    { $group: { _id: '$category', total: { $sum: '$amount' } } }
  ]);
}

async function getMonthlySpending(userId) {
  return Transaction.aggregate([
    { $match: { userId: userId } },
    {
      $group: {
        _id: { $month: '$date' },
        total: { $sum: '$amount' }
      }
    },
    { $sort: { _id: 1 } }
  ]);
}

module.exports = { getSpendingByCategory, getMonthlySpending };