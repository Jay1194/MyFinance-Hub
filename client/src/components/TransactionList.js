import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  List, ListItem, ListItemText, Typography, CircularProgress 
} from '@mui/material';

const TransactionList = ({ token, refreshKey }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/transactions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTransactions(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setError('Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [token, refreshKey]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <List>
      {transactions.length === 0 ? (
        <Typography>No transactions found.</Typography>
      ) : (
        transactions.map((transaction) => (
          <ListItem key={transaction._id}>
            <ListItemText
              primary={transaction.description}
              secondary={`$${transaction.amount.toFixed(2)} - ${transaction.category} - ${new Date(transaction.date).toLocaleDateString()}`}
            />
          </ListItem>
        ))
      )}
    </List>
  );
};

export default TransactionList;