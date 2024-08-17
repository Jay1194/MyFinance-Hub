import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

const BudgetList = ({ token }) => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBudgets();
  }, [token]);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/budgets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBudgets(response.data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      setError('Failed to fetch budgets');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Typography>Loading budgets...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <List>
      {budgets.map((budget) => (
        <ListItem key={budget._id}>
          <ListItemText
            primary={budget.category}
            secondary={`$${budget.amount} - $${budget.spent} spent`}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default BudgetList;