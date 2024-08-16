import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, LinearProgress } from '@mui/material';

const FinancialGoals = ({ token }) => {
  const [goals, setGoals] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', targetAmount: '', currentAmount: 0 });

  useEffect(() => {
    fetchGoals();
  }, [token]);

  const fetchGoals = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/goals', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGoals(response.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const handleAddGoal = async () => {
    try {
      await axios.post('http://localhost:3000/api/goals', newGoal, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOpenDialog(false);
      setNewGoal({ name: '', targetAmount: '', currentAmount: 0 });
      fetchGoals();
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  return (
    <div>
      <Typography variant="h6">Financial Goals</Typography>
      <List>
        {goals.map((goal) => (
          <ListItem key={goal._id}>
            <ListItemText
              primary={goal.name}
              secondary={
                <>
                  <Typography component="span" variant="body2">
                    ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(goal.currentAmount / goal.targetAmount) * 100}
                  />
                </>
              }
            />
          </ListItem>
        ))}
      </List>
      <Button onClick={() => setOpenDialog(true)}>Add New Goal</Button>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Financial Goal</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Goal Name"
            fullWidth
            value={newGoal.name}
            onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Target Amount"
            type="number"
            fullWidth
            value={newGoal.targetAmount}
            onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddGoal}>Add Goal</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FinancialGoals;