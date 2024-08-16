import React, { useState, useEffect } from 'react';
import { 
  List, ListItem, ListItemText, ListItemSecondaryAction, 
  Typography, LinearProgress, Box, Chip, IconButton 
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import axios from 'axios';
import '../css/budgetList.css';

const BudgetList = ({ token, onBudgetSelect }) => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/budgets', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBudgets(response.data);
      } catch (error) {
        console.error('Error fetching budgets:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBudgets();
  }, [token]);

  if (loading) {
    return <LinearProgress className="budget-progress" />;
  }

  return (
    <List>
      {budgets.map((budget) => (
        <ListItem key={budget._id}>
          <ListItemText
            primary={budget.category}
            secondary={
              <React.Fragment>
                <Typography component="span" variant="body2">
                  ${budget.spent.toFixed(2)} / ${budget.amount.toFixed(2)}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(budget.spent / budget.amount) * 100}
                  style={{ marginTop: 8, marginBottom: 8 }}
                />
                <Chip
                  label={`${((budget.spent / budget.amount) * 100).toFixed(0)}% used`}
                  color={budget.spent > budget.amount ? "secondary" : "primary"}
                  size="small"
                />
              </React.Fragment>
            }
          />
          <ListItemSecondaryAction>
            <IconButton edge="end" onClick={() => onBudgetSelect(budget._id)}>
              <ArrowForward />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default BudgetList;