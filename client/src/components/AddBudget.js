import React, { useState } from 'react';
import { 
  TextField, Button, Typography, Box, Select, MenuItem, FormControl, InputLabel 
} from '@mui/material';
import axios from 'axios';

const AddBudget = ({ token, onBudgetAdded, onCancel, categories }) => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/budgets',
        { category, amount: parseFloat(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onBudgetAdded();
    } catch (error) {
      console.error('Error adding budget:', error);
      setError('Failed to add budget');
    }
  };

  return (
    <Box className="add-budget-form">
      <Typography variant="h6" gutterBottom>Add New Budget</Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
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
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        {error && <Typography color="error">{error}</Typography>}
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button type="submit" variant="contained" color="primary">
            Add Budget
          </Button>
          <Button onClick={onCancel} variant="outlined">
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddBudget;