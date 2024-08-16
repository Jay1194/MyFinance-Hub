const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const Budget = require('../models/Budget');
const { calculateActualSpending } = require('../services/budgetService');
const { checkBudgetStatus, sendNotification } = require('../services/notificationService');


// Create a new budget
router.post('/', authenticateToken, async (req, res) => {
  try {
    const budget = new Budget({
      userId: req.user.id,
      ...req.body
    });
    await budget.save();
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create budget' });
  }
});

// Update a budget
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    res.json(budget);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update budget' });
  }
});

// Delete a budget
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete budget' });
  }
});

// Get all budgets for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id });
    
    const budgetsWithRemaining = budgets.map(budget => {
      const budgetObj = budget.toObject();
      return {
        ...budgetObj,
        remaining: budgetObj.amount - budgetObj.spent
      };
    });

    res.json(budgetsWithRemaining);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
});


// Get budget vs actual spending data for visualization
router.get('/visualization', authenticateToken, async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id });
    
    const visualizationData = budgets.map(budget => ({
      category: budget.category,
      budgeted: budget.amount,
      spent: budget.spent
    }));

    res.json(visualizationData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch visualization data' });
  }
});

// Check budgets and send notifications
router.post('/check', authenticateToken, async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id });
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const actualSpending = await calculateActualSpending(req.user.id, startOfMonth, endOfMonth);
    
    for (let budget of budgets) {
      const status = await checkBudgetStatus(budget, actualSpending);
      if (status === 'exceeded') {
        await sendNotification(req.user.id, `You have exceeded your ${budget.category} budget.`);
      } else if (status === 'approaching') {
        await sendNotification(req.user.id, `You are approaching your ${budget.category} budget limit.`);
      }
    }

    res.json({ message: 'Budget check completed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check budgets' });
  }
});

module.exports = router;