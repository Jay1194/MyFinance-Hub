import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Container } from '@mui/material';

const AddTransaction = ({ token, onTransactionAdded }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/transactions', 
        { description, amount: parseFloat(amount), category, date },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Transaction added:', response.data);
      setDescription('');
      setAmount('');
      setCategory('');
      setDate('');
      if (onTransactionAdded) onTransactionAdded();
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h6">Add New Transaction</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button type="submit" fullWidth variant="contained" color="primary">
          Add Transaction
        </Button>
      </form>
    </Container>
  );
};

export default AddTransaction;