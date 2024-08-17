import React, { useState } from 'react';
import { 
  TextField, Button, Typography, Box, Select, MenuItem, FormControl, InputLabel 
} from '@mui/material';
import axios from 'axios';

const AddTransaction = ({ token, onTransactionAdded, onCancel, categories }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/transactions',
        { amount: parseFloat(amount), description, category, date },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // After successful transaction addition, update budgets
      await axios.post('http://localhost:3000/api/budgets/update-spent',
        { category, amount: parseFloat(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onTransactionAdded();
    } catch (error) {
      console.error('Error adding transaction:', error);
      setError('Failed to add transaction');
    }
  };

  return (
    <Box className="add-transaction-form">
      <Typography variant="h6" gutterBottom>Add New Transaction</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Amount"
          type="number"
          fullWidth
          margin="normal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <TextField
          label="Description"
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
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
          label="Date"
          type="date"
          fullWidth
          margin="normal"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          required
        />
        {error && <Typography color="error">{error}</Typography>}
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button type="submit" variant="contained" color="primary">
            Add Transaction
          </Button>
          <Button onClick={onCancel} variant="outlined">
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddTransaction;