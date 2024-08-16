const Transaction = require('../models/Transaction');

async function calculateActualSpending(userId, startDate, endDate) {
  const transactions = await Transaction.aggregate([
    {
      $match: {
        userId: userId,
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$category',
        totalSpent: { $sum: '$amount' }
      }
    }
  ]);

  return transactions.reduce((acc, transaction) => {
    acc[transaction._id] = transaction.totalSpent;
    return acc;
  }, {});
}

module.exports = { calculateActualSpending };