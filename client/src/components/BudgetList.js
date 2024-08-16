import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography, Box, CircularProgress } from '@mui/material';

const BudgetList = ({ token, onBudgetSelect }) => {
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
      setError(null);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      setError('Failed to fetch budgets. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <List>
      {budgets.map((budget) => (
        <ListItem key={budget._id} button onClick={() => onBudgetSelect(budget._id)}>
          <ListItemText
            primary={budget.category}
            secondary={
              <React.Fragment>
                <Typography component="span" variant="body2">
                  ${budget.spent.toFixed(2)} / ${budget.amount.toFixed(2)}
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    backgroundColor: '#e0e0e0',
                    borderRadius: 1,
                    mt: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: `${(budget.spent / budget.amount) * 100}%`,
                      backgroundColor: 'primary.main',
                      height: 8,
                      borderRadius: 1,
                    }}
                  />
                </Box>
              </React.Fragment>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default BudgetList;