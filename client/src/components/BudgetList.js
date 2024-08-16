import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography, Box } from '@mui/material';

const BudgetList = ({ token }) => {
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/budgets', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBudgets(response.data);
      } catch (error) {
        console.error('Error fetching budgets:', error);
      }
    };
    fetchBudgets();
  }, [token]);

  return (
    <List>
      {budgets.map((budget) => (
        <ListItem key={budget._id}>
          <ListItemText
            primary={budget.category}
            secondary={
              <>
                <Typography component="span" variant="body2">
                  ${budget.spent.toFixed(2)} / ${budget.amount.toFixed(2)}
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    backgroundColor: '#e0e0e0',
                    borderRadius: 1,
                    mr: 1,
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
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default BudgetList;