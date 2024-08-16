const axios = require('axios');
const { alphaVantageRateLimiter } = require('../middlewares/rateLimiter');

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

async function getStockPrice(symbol) {
  return new Promise((resolve, reject) => {
    alphaVantageRateLimiter(null, null, () => {
      axios.get(`https://www.alphavantage.co/query`, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: symbol,
          apikey: ALPHA_VANTAGE_API_KEY
        }
      })
      .then(response => {
        resolve(response.data['Global Quote']['05. price']);
      })
      .catch(error => {
        console.error('Error fetching stock price:', error);
        reject(error);
      });
    });
  });
}

module.exports = { getStockPrice };