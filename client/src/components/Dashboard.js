import React, { useState, useEffect, useCallback } from 'react';
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
    h6: {
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: '20px',
          boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .05)',
        },
      },
    },
  },
});

const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Health', 'Education', 'Other'];

const Dashboard = ({ token, onLogout }) => {
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [plaidLinked, setPlaidLinked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [user, setUser] = useState(null);

  const handleRefresh = useCallback(() => {
    setRefreshKey(old => old + 1);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch user data');
      }
    };

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

    fetchUserData();
    checkPlaidStatus();
  }, [token]);

  const handlePlaidSuccess = useCallback(() => {
    setPlaidLinked(true);
    handleRefresh();
  }, [handleRefresh]);

  const handleBudgetAdded = useCallback(() => {
    setShowAddBudget(false);
    handleRefresh();
  }, [handleRefresh]);

  const handleTransactionAdded = useCallback(() => {
    setShowAddTransaction(false);
    handleRefresh();
  }, [handleRefresh]);

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
            MyFinance Hub
          </Typography>
          <Button color="inherit" onClick={onLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Container className="dashboard-container">
        {error && <Typography color="error" className="error-message">{error}</Typography>}
        <Box className="welcome-container" mb={4} mt={2}>
          {user && plaidLinked ? (
            <Typography variant="h3" align="center" gutterBottom>
              Welcome, {user.firstName} {user.lastName}!
            </Typography>
          ) : (
            <Box textAlign="center">
              <PlaidLinkButton token={token} onSuccess={handlePlaidSuccess} />
            </Box>
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
              <BudgetList 
                token={token} 
                refreshKey={refreshKey} 
                onRefresh={handleRefresh}
                categories={CATEGORIES}
              />
              {!showAddBudget ? (
                <Button 
                  onClick={() => setShowAddBudget(true)} 
                  className="add-button"
                  variant="contained" 
                  color="primary"
                >
                  Add New Budget
                </Button>
              ) : (
                <AddBudget 
                  token={token} 
                  onBudgetAdded={handleBudgetAdded} 
                  onCancel={() => setShowAddBudget(false)}
                  categories={CATEGORIES}
                />
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper className="section-paper">
              <Typography variant="h6">Transactions</Typography>
              <TransactionList token={token} refreshKey={refreshKey} />
              {!showAddTransaction ? (
                <Button 
                  onClick={() => setShowAddTransaction(true)} 
                  className="add-button"
                  variant="contained" 
                  color="primary"
                >
                  Add New Transaction
                </Button>
              ) : (
                <AddTransaction 
                  token={token} 
                  onTransactionAdded={() => {
                    handleTransactionAdded();
                    handleRefresh();
                  }} 
                  onCancel={() => setShowAddTransaction(false)}
                  categories={CATEGORIES}
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