const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const plaidClient = require('../config/plaid');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

router.post('/create_link_token', authenticateToken, async (req, res) => {
  try {
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: req.user.id },
      client_name: 'MyFinance-Hub',
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en',
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error creating link token:', error);
    res.status(500).json({ error: 'Failed to create link token' });
  }
});

router.post('/set_access_token', authenticateToken, async (req, res) => {
  try {
    console.log('Attempting to exchange public token:', req.body.public_token);
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: req.body.public_token,
    });
    const accessToken = response.data.access_token;
    
    await User.findByIdAndUpdate(req.user.id, { plaidAccessToken: accessToken });
    
    console.log('Access token successfully obtained and saved');
    res.json({ success: true, message: 'Access token saved successfully' });
  } catch (error) {
    console.error('Error exchanging public token:', error);
    res.status(500).json({ 
      error: 'Failed to exchange public token', 
      details: error.response?.data || error.message 
    });
  }
});

router.get('/status', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ linked: !!user.plaidAccessToken });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check Plaid status' });
  }
});

router.get('/balances', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.plaidAccessToken) {
      return res.status(400).json({ error: 'Plaid account not connected' });
    }

    const balanceResponse = await plaidClient.accountsBalanceGet({
      access_token: user.plaidAccessToken
    });

    res.json(balanceResponse.data.accounts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch balances' });
  }
});

router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.plaidAccessToken) {
      return res.status(400).json({ error: 'Plaid account not connected' });
    }

    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    
    const response = await plaidClient.transactionsGet({
      access_token: user.plaidAccessToken,
      start_date: oneMonthAgo.toISOString().split('T')[0],
      end_date: now.toISOString().split('T')[0],
    });

    const transactions = response.data.transactions;

    // Save transactions to the database
    for (let transaction of transactions) {
      await Transaction.findOneAndUpdate(
        { 
          userId: req.user.id,
          date: new Date(transaction.date),
          amount: transaction.amount,
          description: transaction.name
        },
        {
          userId: req.user.id,
          date: new Date(transaction.date),
          amount: transaction.amount,
          category: transaction.category[0],
          description: transaction.name
        },
        { upsert: true, new: true }
      );
    }

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching Plaid transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

router.get('/financial_overview', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.plaidAccessToken) {
      return res.status(400).json({ error: 'Plaid account not connected' });
    }

    // Get account balances
    const balanceResponse = await plaidClient.accountsBalanceGet({
      access_token: user.plaidAccessToken
    });

    // Get transactions for the last 30 days
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    const transactionsResponse = await plaidClient.transactionsGet({
      access_token: user.plaidAccessToken,
      start_date: thirtyDaysAgo.toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
    });

    // Calculate estimated monthly income
    const deposits = transactionsResponse.data.transactions.filter(
      transaction => transaction.amount > 0
    );
    const estimatedMonthlyIncome = deposits.reduce(
      (sum, transaction) => sum + transaction.amount, 0
    );

    res.json({
      accounts: balanceResponse.data.accounts,
      estimatedMonthlyIncome,
      recentTransactions: transactionsResponse.data.transactions.slice(0, 10) // Get 10 most recent transactions
    });
  } catch (error) {
    console.error('Error fetching financial overview:', error);
    res.status(500).json({ error: 'Failed to fetch financial overview' });
  }
});

router.get('/accounts', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.plaidAccessToken) {
      return res.status(400).json({ error: 'Plaid account not connected' });
    }

    const response = await plaidClient.accountsGet({
      access_token: user.plaidAccessToken
    });

    res.json(response.data.accounts);
  } catch (error) {
    console.error('Error fetching Plaid accounts:', error);
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
});

module.exports = router;