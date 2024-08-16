import React, { useState } from 'react';
import { Container, Grid, Paper, Typography, Button } from '@mui/material';
import BudgetList from './BudgetList';
import AddBudget from './AddBudget';
import TransactionList from './TransactionList';
import AddTransaction from './AddTransaction';

const Dashboard = ({ token }) => {
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [budgetListKey, setBudgetListKey] = useState(0);
  const [transactionListKey, setTransactionListKey] = useState(0);

  const handleBudgetAdded = () => {
    setShowAddBudget(false);
    setBudgetListKey(prevKey => prevKey + 1);
  };

  const handleTransactionAdded = () => {
    setShowAddTransaction(false);
    setTransactionListKey(prevKey => prevKey + 1);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Financial Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper>
            <Typography variant="h6">Budgets</Typography>
            <BudgetList key={budgetListKey} token={token} />
            {showAddBudget ? (
              <AddBudget token={token} onBudgetAdded={handleBudgetAdded} />
            ) : (
              <Button onClick={() => setShowAddBudget(true)}>Add New Budget</Button>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper>
            <Typography variant="h6">Transactions</Typography>
            <TransactionList key={transactionListKey} token={token} />
            {showAddTransaction ? (
              <AddTransaction token={token} onTransactionAdded={handleTransactionAdded} />
            ) : (
              <Button onClick={() => setShowAddTransaction(true)}>Add New Transaction</Button>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;