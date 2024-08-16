const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const Goal = require('../models/Goal');

// Get all goals for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
});

// Add a new goal
router.post('/', authenticateToken, async (req, res) => {
  try {
    const goal = new Goal({
      userId: req.user.id,
      name: req.body.name,
      targetAmount: req.body.targetAmount,
      currentAmount: req.body.currentAmount || 0
    });
    await goal.save();
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create goal' });
  }
});

// Update a goal
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    res.json(goal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update goal' });
  }
});

// Delete a goal
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete goal' });
  }
});

module.exports = router;