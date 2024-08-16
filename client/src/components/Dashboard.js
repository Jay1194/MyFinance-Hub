import React, { useState } from 'react';
import { Container, Grid, Paper, Typography, Button, AppBar, Toolbar } from '@mui/material';
import BudgetList from './BudgetList';
import AddBudget from './AddBudget';
import TransactionList from './TransactionList';
import AddTransaction from './AddTransaction';
import BudgetDetail from './BudgetDetail';
import FinancialGoals from './FinancialGoals';
import InvestmentTracking from './InvestmentTracking';
import ReportsAndInsights from './ReportsAndInsights';

const Dashboard = ({ token, onLogout }) => {
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [selectedBudgetId, setSelectedBudgetId] = useState(null);

  const handleBudgetAdded = () => {
    setShowAddBudget(false);
  };

  const handleTransactionAdded = () => {
    setShowAddTransaction(false);
  };

  const handleBudgetSelect = (budgetId) => {
    setSelectedBudgetId(budgetId);
  };

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