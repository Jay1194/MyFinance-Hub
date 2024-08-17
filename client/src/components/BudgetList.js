import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  List, ListItem, ListItemText, Typography, IconButton, 
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, Select, MenuItem, FormControl, InputLabel,
  LinearProgress, Box
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const BudgetList = ({ token, refreshKey, onRefresh, categories }) => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBudget, setEditingBudget] = useState(null);

  useEffect(() => {
    fetchBudgets();
  }, [token, refreshKey]);

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

  const handleEdit = (budget) => {
    setEditingBudget(budget);
  };

  const handleDelete = async (budgetId) => {
    try {
      await axios.delete(`http://localhost:3000/api/budgets/${budgetId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBudgets();
    } catch (error) {
      console.error('Error deleting budget:', error);
      setError('Failed to delete budget');
    }
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://localhost:3000/api/budgets/${editingBudget._id}`, 
        { category: editingBudget.category, amount: editingBudget.amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingBudget(null);
      fetchBudgets();
    } catch (error) {
      console.error('Error updating budget:', error);
      setError('Failed to update budget');
    }
  };

  if (loading) return <LinearProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      <List>
        {budgets.map((budget) => (
          <ListItem key={budget._id}>
            <ListItemText
              primary={budget.category}
              secondary={
                <React.Fragment>
                  <Typography component="span" variant="body2" color="textPrimary">
                    ${budget.spent.toFixed(2)} / ${budget.amount.toFixed(2)}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(budget.spent / budget.amount) * 100} 
                    style={{marginTop: '5px'}}
                  />
                </React.Fragment>
              }
            />
            <Box>
              <IconButton onClick={() => handleEdit(budget)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDelete(budget._id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>

      <Dialog open={!!editingBudget} onClose={() => setEditingBudget(null)}>
        <DialogTitle>Edit Budget</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={editingBudget?.category || ''}
              onChange={(e) => setEditingBudget({...editingBudget, category: e.target.value})}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Amount"
            type="number"
            fullWidth
            margin="normal"
            value={editingBudget?.amount || ''}
            onChange={(e) => setEditingBudget({...editingBudget, amount: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingBudget(null)}>Cancel</Button>
          <Button onClick={handleSaveEdit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BudgetList;