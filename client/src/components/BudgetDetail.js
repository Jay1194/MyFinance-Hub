import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Paper, List, ListItem, ListItemText, LinearProgress, Box } from '@mui/material';

const BudgetDetail = ({ token, budgetId }) => {
  const [budget, setBudget] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchBudgetDetails = async () => {
      try {
        const budgetResponse = await axios.get(`http://localhost:3000/api/budgets/${budgetId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBudget(budgetResponse.data);

        const transactionsResponse = await axios.get(`http://localhost:3000/api/transactions?category=${budgetResponse.data.category}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTransactions(transactionsResponse.data);
      } catch (error) {
        console.error('Error fetching budget details:', error);
      }
    };
    fetchBudgetDetails();
  }, [token, budgetId]);

  if (!budget) {
    return <Typography>Loading...</Typography>;
  }

  const percentageSpent = (budget.spent / budget.amount) * 100;

  return (
    <Paper style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h5">{budget.category} Budget</Typography>
      <Typography>Amount: ${budget.amount}</Typography>
      <Typography>Spent: ${budget.spent}</Typography>
      <Typography>Remaining: ${budget.amount - budget.spent}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" value={percentageSpent} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            percentageSpent,
          )}%`}</Typography>
        </Box>
      </Box>
      <Typography variant="h6" style={{ marginTop: '20px' }}>Related Transactions</Typography>
      <List>
        {transactions.map((transaction) => (
          <ListItem key={transaction._id}>
            <ListItemText
              primary={transaction.description}
              secondary={`$${transaction.amount} - ${new Date(transaction.date).toLocaleDateString()}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default BudgetDetail;