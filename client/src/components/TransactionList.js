import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

const TransactionList = ({ token }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/transactions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };
    fetchTransactions();
  }, [token]);

  return (
    <List>
      {transactions.map((transaction) => (
        <ListItem key={transaction._id}>
          <ListItemText
            primary={transaction.description}
            secondary={
              <>
                <Typography component="span" variant="body2" color="textPrimary">
                  ${transaction.amount.toFixed(2)}
                </Typography>
                {" — " + transaction.category}
                {" — " + new Date(transaction.date).toLocaleDateString()}
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default TransactionList;