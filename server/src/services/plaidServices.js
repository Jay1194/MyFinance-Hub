const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const User = require('../models/User');

const plaidClient = new PlaidApi(
  new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
        'PLAID-SECRET': process.env.PLAID_SECRET,
      },
    },
  })
);

async function createLinkToken(userId) {
  const configs = {
    user: { client_user_id: userId },
    client_name: 'MyFinance App',
    products: ['transactions'],
    country_codes: ['US'],
    language: 'en'
  };

  const createTokenResponse = await plaidClient.linkTokenCreate(configs);
  return createTokenResponse.data.link_token;
}

async function exchangePublicToken(publicToken, userId) {
  const response = await plaidClient.itemPublicTokenExchange({ public_token: publicToken });
  const accessToken = response.data.access_token;
  
  await User.findByIdAndUpdate(userId, { plaidAccessToken: accessToken });
  
  return accessToken;
}

async function fetchTransactions(accessToken, startDate, endDate) {
  const response = await plaidClient.transactionsGet({
    access_token: accessToken,
    start_date: startDate,
    end_date: endDate,
  });
  
  return response.data.transactions;
}

module.exports = { createLinkToken, exchangePublicToken, fetchTransactions };