import React, { useCallback, useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import axios from 'axios';
import { Button, CircularProgress } from '@mui/material';

const PlaidLinkButton = ({ token, onSuccess }) => {
  const [linkToken, setLinkToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const createLinkToken = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          'http://localhost:3000/api/plaid/create_link_token',
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLinkToken(response.data.link_token);
      } catch (error) {
        console.error('Error creating link token:', error);
      } finally {
        setLoading(false);
      }
    };

    createLinkToken();
  }, [token]);

  const handleSuccess = useCallback(async (public_token) => {
    try {
      await axios.post(
        'http://localhost:3000/api/plaid/set_access_token',
        { public_token },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSuccess();
    } catch (error) {
      console.error('Error setting access token:', error);
    }
  }, [token, onSuccess]);

  const config = {
    token: linkToken,
    onSuccess: handleSuccess,
    onExit: (err, metadata) => console.log('Plaid Link exit:', err, metadata),
    onEvent: (eventName, metadata) => console.log('Plaid Link event:', eventName, metadata),
  };

  const { open, ready } = usePlaidLink(config);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Button
      onClick={() => open()}
      disabled={!ready || !linkToken}
      variant="contained"
      color="primary"
    >
      Connect a bank account
    </Button>
  );
};

export default PlaidLinkButton;