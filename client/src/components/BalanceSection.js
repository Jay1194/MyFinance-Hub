import React, { useState, useEffect } from 'react';
import { Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import axios from 'axios';
import '../css/balanceSection.css';

const BalanceSection = ({ token }) => {
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/plaid/balances', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBalances(response.data);
      } catch (error) {
        console.error('Error fetching balances:', error);
        setError('Failed to fetch account balances.');
      } finally {
        setLoading(false);
      }
    };
    fetchBalances();
  }, [token]);

  if (loading) return <Typography>Loading balances...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div className="balance-section">
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