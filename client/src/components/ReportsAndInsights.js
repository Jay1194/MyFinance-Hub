import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Grid, CircularProgress } from '@mui/material';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ReportsAndInsights = ({ token, refreshKey, plaidLinked }) => {
  const [expensesByCategory, setExpensesByCategory] = useState([]);
  const [monthlySpending, setMonthlySpending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportData = async () => {
      if (!plaidLinked) return;

      try {
        setLoading(true);
        const [expensesResponse, spendingResponse] = await Promise.all([
          axios.get('http://localhost:3000/api/reports/spending-by-category', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:3000/api/reports/monthly-spending', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setExpensesByCategory(expensesResponse.data.map(item => ({
          name: item.category,
          value: Math.abs(item.total)
        })));

        setMonthlySpending(spendingResponse.data.map(item => ({
          month: new Date(item.month).toLocaleString('default', { month: 'short' }),
          amount: Math.abs(item.total)
        })));

        setError(null);
      } catch (error) {
        console.error('Error fetching report data:', error);
        setError('Failed to fetch report data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [token, plaidLinked, refreshKey]);

  if (!plaidLinked) {
    return <Typography>Connect your bank account to see reports and insights.</Typography>;
  }

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div>
      <Typography variant="h6" gutterBottom>Reports and Insights</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1">Expenses by Category</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie dataKey="value" data={expensesByCategory} fill="#8884d8" label />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1">Monthly Spending</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlySpending}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </div>
  );
};

export default ReportsAndInsights;