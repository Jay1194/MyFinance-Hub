const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const Budget = require('../models/Budget');

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

// Get all budgets for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch budgets' });
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

module.exports = router;