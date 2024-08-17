import React, { useState, useEffect } from 'react';
import { Typography, List, ListItem, ListItemText, Divider, CircularProgress } from '@mui/material';
import axios from 'axios';

const BalanceSection = ({ token, refreshKey, plaidLinked }) => {
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!plaidLinked) return;
      
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/plaid/balances', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBalances(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching balances:', error);
        setError('Failed to fetch account balances.');
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, [token, plaidLinked, refreshKey]);

  if (!plaidLinked) {
    return <Typography>Connect your bank account to see balance information.</Typography>;
  }

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div>
      <Typography variant="h6" gutterBottom>Account Balances</Typography>
      <List>
        {balances.map((account, index) => (
          <React.Fragment key={account.account_id}>
            <ListItem>
              <ListItemText
                primary={account.name}
                secondary={`$${account.balances.current.toFixed(2)}`}
              />
            </ListItem>
            {index < balances.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </div>
  );
};

export default BalanceSection;