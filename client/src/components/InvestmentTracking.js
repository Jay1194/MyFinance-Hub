import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const InvestmentTracking = ({ token }) => {
  const [investments, setInvestments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newInvestment, setNewInvestment] = useState({ symbol: '', shares: '', purchasePrice: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInvestments();
  }, [token]);

  const fetchInvestments = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/investments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInvestments(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching investments:', error);
      setError('Failed to fetch investments. Please try again later.');
    }
  };

  const handleAddInvestment = async () => {
    try {
      await axios.post('http://localhost:3000/api/investments', newInvestment, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOpenDialog(false);
      setNewInvestment({ symbol: '', shares: '', purchasePrice: '' });
      fetchInvestments();
    } catch (error) {
      console.error('Error adding investment:', error);
      setError('Failed to add investment. Please try again.');
    }
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div>
      <Typography variant="h6">Investment Tracking</Typography>
      <List>
        {investments.map((investment) => (
          <ListItem key={investment._id}>
            <ListItemText
              primary={investment.symbol}
              secondary={
                <>
                  <Typography component="span" variant="body2">
                    Shares: {investment.shares}, Purchase Price: ${investment.purchasePrice?.toFixed(2) || 'N/A'}
                  </Typography>
                  {investment.currentValue && (
                    <Typography component="span" variant="body2">
                      Current Value: ${investment.currentValue.toFixed(2)}
                    </Typography>
                  )}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
      <Button onClick={() => setOpenDialog(true)}>Add New Investment</Button>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Investment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Stock Symbol"
            fullWidth
            value={newInvestment.symbol}
            onChange={(e) => setNewInvestment({ ...newInvestment, symbol: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Number of Shares"
            type="number"
            fullWidth
            value={newInvestment.shares}
            onChange={(e) => setNewInvestment({ ...newInvestment, shares: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Purchase Price"
            type="number"
            fullWidth
            value={newInvestment.purchasePrice}
            onChange={(e) => setNewInvestment({ ...newInvestment, purchasePrice: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddInvestment}>Add Investment</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InvestmentTracking;