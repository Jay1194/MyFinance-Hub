import React, { useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import axios from 'axios';
import { Button } from '@mui/material';

const PlaidLinkButton = ({ token, onPlaidSuccess }) => {
  const createLinkToken = useCallback(async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/plaid/create_link_token', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.link_token;
    } catch (error) {
      console.error('Error creating link token:', error);
      throw error;
    }
  }, [token]);

  const handlePlaidSuccess = useCallback(async (public_token) => {
    try {
      await axios.post('http://localhost:3000/api/plaid/set_access_token', 
        { public_token },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onPlaidSuccess();
    } catch (error) {
      console.error('Error setting access token:', error);
    }
  }, [token, onPlaidSuccess]);

  const config = {
    token: null,
    onSuccess: handlePlaidSuccess,
    onExit: (err, metadata) => console.log('Plaid Link exit:', err, metadata),
    onEvent: (eventName, metadata) => console.log('Plaid Link event:', eventName, metadata),
    createLinkToken
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <Button 
      variant="contained" 
      onClick={() => open()} 
      disabled={!ready}
    >
      Connect a bank account
    </Button>
  );
};

export default PlaidLinkButton;