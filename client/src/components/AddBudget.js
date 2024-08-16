import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Container } from '@mui/material';

const AddBudget = ({ token, onBudgetAdded }) => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/budgets', 
        { category, amount: parseFloat(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Budget added:', response.data);
      setCategory('');
      setAmount('');
      if (onBudgetAdded) onBudgetAdded();
    } catch (error) {
      console.error('Error adding budget:', error);
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h6">Add New Budget</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button type="submit" fullWidth variant="contained" color="primary">
          Add Budget
        </Button>
      </form>
    </Container>
  );
};

export default AddBudget;