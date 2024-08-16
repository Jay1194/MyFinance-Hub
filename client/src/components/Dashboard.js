import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Button, AppBar, Toolbar, CircularProgress } from '@mui/material';
import axios from 'axios';
import BudgetList from './BudgetList';
import AddBudget from './AddBudget';
import TransactionList from './TransactionList';
import AddTransaction from './AddTransaction';
import BudgetDetail from './BudgetDetail';
import FinancialGoals from './FinancialGoals';
import InvestmentTracking from './InvestmentTracking';
import ReportsAndInsights from './ReportsAndInsights';
import PlaidLinkButton from './PlaidLinkButton';

const Dashboard = ({ token, onLogout }) => {
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [selectedBudgetId, setSelectedBudgetId] = useState(null);
  const [plaidLinked, setPlaidLinked] = useState(false);
  const [financialOverview, setFinancialOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFinancialOverview = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/plaid/financial_overview', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFinancialOverview(response.data);
      setPlaidLinked(true);
      setError(null);
    } catch (error) {
      console.error('Error fetching financial overview:', error);
      setPlaidLinked(false);
      setError('Failed to fetch financial overview. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialOverview();
  }, [token]);

  const handlePlaidSuccess = () => {
    fetchFinancialOverview();
  };

  const handleBudgetAdded = () => {
    setShowAddBudget(false);
  };

  const handleTransactionAdded = () => {
    setShowAddTransaction(false);
  };

  const handleBudgetSelect = (budgetId) => {
    setSelectedBudgetId(budgetId);
  };

  if (loading) return <CircularProgress />;

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Financial Dashboard
          </Typography>
          <Button color="inherit" onClick={onLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: '20px' }}>
        {error && <Typography color="error">{error}</Typography>}
        {!plaidLinked && <PlaidLinkButton token={token} onPlaidSuccess={handlePlaidSuccess} />}
        {financialOverview && (
          <Paper style={{ padding: '1rem', marginBottom: '1rem' }}>
            <Typography variant="h6">Financial Overview</Typography>
            <Typography>Estimated Monthly Income: ${financialOverview.estimatedMonthlyIncome.toFixed(2)}</Typography>
            <Typography>Total Balance: ${financialOverview.accounts.reduce((sum, account) => sum + account.balances.current, 0).toFixed(2)}</Typography>
          </Paper>
        )}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper>
              <Typography variant="h6">Budgets</Typography>
              <BudgetList token={token} onBudgetSelect={handleBudgetSelect} />
              {showAddBudget ? (
                <AddBudget token={token} onBudgetAdded={handleBudgetAdded} />
              ) : (
                <Button onClick={() => setShowAddBudget(true)}>Add New Budget</Button>
              )}
            </Paper>
            {selectedBudgetId && (
              <BudgetDetail token={token} budgetId={selectedBudgetId} />
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper>
              <Typography variant="h6">Transactions</Typography>
              <TransactionList token={token} />
              {showAddTransaction ? (
                <AddTransaction token={token} onTransactionAdded={handleTransactionAdded} />
              ) : (
                <Button onClick={() => setShowAddTransaction(true)}>Add New Transaction</Button>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper>
              <FinancialGoals token={token} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper>
              <InvestmentTracking token={token} />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper>
              <ReportsAndInsights token={token} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Dashboard;