import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Paper, Typography, Button, AppBar, Toolbar, 
  CircularProgress, Box, ThemeProvider, createTheme, CssBaseline,
  Select, MenuItem, FormControl, InputLabel
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

// Predefined categories
export const CATEGORIES = [
  'Food & Dining', 'Transportation', 'Housing', 'Utilities', 'Healthcare',
  'Personal', 'Entertainment', 'Education', 'Shopping', 'Travel', 'Income'
];

const Dashboard = ({ token, onLogout }) => {
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [plaidLinked, setPlaidLinked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statusResponse, accountsResponse] = await Promise.all([
          axios.get('http://localhost:3000/api/plaid/status', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:3000/api/plaid/accounts', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        setPlaidLinked(statusResponse.data.linked);
        setAccounts(accountsResponse.data);
        if (accountsResponse.data.length > 0) {
          setSelectedAccount(accountsResponse.data[0].account_id);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch account data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handlePlaidSuccess = () => {
    setPlaidLinked(true);
  };

  const handleBudgetAdded = () => {
    setShowAddBudget(false);
  };

  const handleTransactionAdded = () => {
    setShowAddTransaction(false);
  };

  const handleBudgetSelect = (budgetId) => {
    console.log('Selected budget:', budgetId);
    // Implement budget selection logic here
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
        {!plaidLinked && (
          <Box className="plaid-button-container">
            <PlaidLinkButton token={token} onSuccess={handlePlaidSuccess} />
          </Box>
        )}
        {plaidLinked && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Account</InputLabel>
            <Select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
            >
              {accounts.map((account) => (
                <MenuItem key={account.account_id} value={account.account_id}>
                  {account.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper className="balance-paper">
              <BalanceSection token={token} selectedAccount={selectedAccount} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper className="insights-paper">
              <ReportsAndInsights token={token} selectedAccount={selectedAccount} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper className="section-paper">
              <Typography variant="h6">Budgets</Typography>
              <BudgetList token={token} onBudgetSelect={handleBudgetSelect} />
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
                  categories={CATEGORIES}
                />
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper className="section-paper">
              <Typography variant="h6">Transactions</Typography>
              <TransactionList token={token} selectedAccount={selectedAccount} />
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
                  categories={CATEGORIES}
                  selectedAccount={selectedAccount}
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