import React, { useState, useEffect } from 'react';
import { 
  List, ListItem, ListItemText, ListItemSecondaryAction, 
  Typography, IconButton, Chip 
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import axios from 'axios';
import '../css/transactionList.css';

const TransactionList = ({ token }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/transactions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [token]);

  if (loading) {
    return <Typography>Loading transactions...</Typography>;
  }

  return (
    <List className="transaction-list">
      {transactions.map((transaction) => (
        <ListItem key={transaction._id} className="transaction-item">
          <ListItemText
            primary={transaction.description}
            secondary={
              <>
                <Typography component="span" variant="body2" color="textPrimary">
                  ${Math.abs(transaction.amount).toFixed(2)}
                </Typography>
                {" — "}{new Date(transaction.date).toLocaleDateString()}
              </>
            }
          />
          <ListItemSecondaryAction>
            <Chip 
              label={transaction.category} 
              color="primary" 
              variant="outlined" 
              size="small"
              className="transaction-category"
            />
            <IconButton edge="end" aria-label="delete">
              <Delete />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default TransactionList;