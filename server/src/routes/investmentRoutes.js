const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const { alphaVantageRateLimiter } = require('../middlewares/rateLimiter');
const Investment = require('../models/Investment');
const axios = require('axios');

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

// Get all investments for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const investments = await Investment.find({ userId: req.user.id });
    res.json(investments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch investments' });
  }
});

// Add a new investment
router.post('/', authenticateToken, async (req, res) => {
  try {
    const investment = new Investment({
      userId: req.user.id,
      symbol: req.body.symbol,
      shares: req.body.shares,
      purchasePrice: req.body.purchasePrice
    });
    await investment.save();
    res.status(201).json(investment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create investment' });
  }
});

// Get current stock price
router.get('/price/:symbol', authenticateToken, alphaVantageRateLimiter, async (req, res) => {
    try {
      const response = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${req.params.symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`);
      const price = response.data['Global Quote']['05. price'];
      res.json({ price });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch stock price' });
    }
  });
  

module.exports = router;