import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Typography } from '@mui/material';
import PlaidLinkButton from './PlaidLinkButton';

const PlaidIntegration = ({ token }) => {
  const [plaidLinked, setPlaidLinked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkPlaidStatus();
  }, [token]);

  const checkPlaidStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/plaid/status', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlaidLinked(response.data.linked);
    } catch (error) {
      console.error('Error checking Plaid status:', error);
      setError('Failed to check Plaid status');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaidSuccess = () => {
    setPlaidLinked(true);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div>
      {!plaidLinked ? (
        <PlaidLinkButton token={token} onSuccess={handlePlaidSuccess} />
      ) : (
        <Typography>Plaid account connected</Typography>
      )}
    </div>
  );
};

export default PlaidIntegration;