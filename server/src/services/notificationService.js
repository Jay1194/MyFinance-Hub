const User = require('../models/User');

async function checkBudgetStatus(budget, actualSpending) {
  const spent = actualSpending[budget.category] || 0;
  const percentageSpent = (spent / budget.amount) * 100;

  if (percentageSpent >= 100) {
    return 'exceeded';
  } else if (percentageSpent >= 80) {
    return 'approaching';
  }
  return 'ok';
}

async function sendNotification(userId, message) {
  // In a real application, you might send an email, push notification, or save to a notifications table
  console.log(`Notification for user ${userId}: ${message}`);
  // For now, we'll just update a hypothetical 'lastNotification' field on the user
  await User.findByIdAndUpdate(userId, { lastNotification: message });
}

module.exports = { checkBudgetStatus, sendNotification };