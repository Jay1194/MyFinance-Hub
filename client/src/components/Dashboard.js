import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Paper, Typography, Button, AppBar, Toolbar, 
  CircularProgress, Box, ThemeProvider, createTheme, CssBaseline
} from '@mui/material';
import axios from 'axios';
import BudgetList from './BudgetList';
import AddBudget from './AddBudget';
import TransactionList from './TransactionList';
import AddTransaction from './AddTransaction';
import BalanceSection from './BalanceSection';
import ReportsAndInsights from './ReportsAndInsights';
import PlaidLinkButton from './PlaidLinkButton';
import '../css/dashboard.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const Dashboard = ({ token, onLogout }) => {
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [plaidLinked, setPlaidLinked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
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

    checkPlaidStatus();
  }, [token]);

  const handleRefresh = () => {
    setRefreshKey(old => old + 1);
  };

  const handlePlaidSuccess = () => {
    setPlaidLinked(true);
    handleRefresh();
  };

  const handleBudgetAdded = () => {
    setShowAddBudget(false);
    handleRefresh();
  };

  const handleTransactionAdded = () => {
    setShowAddTransaction(false);
    handleRefresh();
  };

  if (loading) return (
    <Box className="loading-container">
      <CircularProgress />
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" className="app-bar">
        <Toolbar>
          <Typography variant="h6" className="app-title">
            MyFinance Dashboard
          </Typography>
          <Button color="inherit" onClick={onLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Container className="dashboard-container">
        {error && <Typography color="error" className="error-message">{error}</Typography>}
        <Box className="plaid-button-container" mb={2}>
          {!plaidLinked ? (
            <PlaidLinkButton token={token} onSuccess={handlePlaidSuccess} />
          ) : (
            <Typography>Plaid account connected</Typography>
          )}
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper className="balance-paper">
              <BalanceSection token={token} refreshKey={refreshKey} plaidLinked={plaidLinked} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper className="insights-paper">
              <ReportsAndInsights token={token} refreshKey={refreshKey} plaidLinked={plaidLinked} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper className="section-paper">
              <Typography variant="h6">Budgets</Typography>
              <BudgetList token={token} refreshKey={refreshKey} />
              <Button 
                onClick={() => setShowAddBudget(true)} 
                className="add-button"
                variant="contained" 
                color="primary"
              >
                Add New Budget
              </Button>
              {showAddBudget && (
                <AddBudget 
                  token={token} 
                  onBudgetAdded={handleBudgetAdded} 
                  onCancel={() => setShowAddBudget(false)}
                />
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper className="section-paper">
              <Typography variant="h6">Transactions</Typography>
              <TransactionList token={token} refreshKey={refreshKey} />
              <Button 
                onClick={() => setShowAddTransaction(true)} 
                className="add-button"
                variant="contained" 
                color="primary"
              >
                Add New Transaction
              </Button>
              {showAddTransaction && (
                <AddTransaction 
                  token={token} 
                  onTransactionAdded={handleTransactionAdded} 
                  onCancel={() => setShowAddTransaction(false)}
                />
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default Dashboard;