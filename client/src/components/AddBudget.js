import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography } from '@mui/material';

const AddBudget = ({ token, onBudgetAdded }) => {
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
      setCategory('');
      setAmount('');
      setError('');
      if (onBudgetAdded) onBudgetAdded();
    } catch (error) {
      console.error('Error adding budget:', error);
      setError('Failed to add budget');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      />
      <TextField
        label="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <Button type="submit">Add Budget</Button>
      {error && <Typography color="error">{error}</Typography>}
    </form>
  );
};

export default AddBudget;