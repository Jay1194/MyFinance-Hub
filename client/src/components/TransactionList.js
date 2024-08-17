import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

const TransactionList = ({ token }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, [token]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Typography>Loading transactions...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <List>
      {transactions.map((transaction) => (
        <ListItem key={transaction._id}>
          <ListItemText
            primary={transaction.description}
            secondary={`$${transaction.amount} - ${transaction.category}`}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default TransactionList;