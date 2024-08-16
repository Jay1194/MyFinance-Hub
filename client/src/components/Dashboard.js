import React, { useState } from 'react';
import { Container, Grid, Paper, Typography, Button } from '@mui/material';
import BudgetList from './BudgetList';
import AddBudget from './AddBudget';

const Dashboard = ({ token }) => {
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [budgetListKey, setBudgetListKey] = useState(0);

  const handleBudgetAdded = () => {
    setShowAddBudget(false);
    setBudgetListKey(prevKey => prevKey + 1);  // This will force BudgetList to re-render
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Financial Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
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
      </Grid>
    </Container>
  );
};

export default Dashboard;