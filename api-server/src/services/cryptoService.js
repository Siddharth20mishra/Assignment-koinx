const axios = require('axios');
const CryptoStats = require('../models/cryptoStats');
const { calculateStandardDeviation } = require('../utils/mathUtils');

/**
 * Fetch cryptocurrency data from CoinGecko API
 * @param {Array<string>} coinIds - Array of coin IDs
 * @returns {Promise<Object>} - Cryptocurrency data
 */
const fetchCryptoData = async (coinIds) => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        ids: coinIds.join(','),
        order: 'market_cap_desc',
        per_page: coinIds.length,
        page: 1,
        sparkline: false,
        price_change_percentage: '24h'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data from CoinGecko:', error);
    throw new Error('Failed to fetch cryptocurrency data');
  }
};

/**
 * Store cryptocurrency stats in the database
 */
const storeCryptoStats = async () => {
  try {
    const coinIds = ['bitcoin', 'ethereum', 'matic-network'];
    const data = await fetchCryptoData(coinIds);

    const statsToStore = [];
    for (const coin of data) {
      statsToStore.push({
        coin: coin.id,
        priceUSD: coin.current_price,
        marketCapUSD: coin.market_cap,
        change24h: coin.price_change_percentage_24h || 0
      });
    }

    // Insert all stats in one operation
    await CryptoStats.insertMany(statsToStore);
    console.log(`Stored stats for ${statsToStore.length} coins`);
    return statsToStore;
  } catch (error) {
    console.error('Error storing crypto stats:', error);
    throw error;
  }
};

/**
 * Get latest stats for a specific coin
 * @param {string} coin - Coin ID
 * @returns {Promise<Object>} - Latest stats
 */
const getLatestStats = async (coin) => {
  try {
    const stats = await CryptoStats.findOne({ coin })
      .sort({ timestamp: -1 })
      .lean();
    
    if (!stats) {
      throw new Error(`No stats found for ${coin}`);
    }

    return {
      price: stats.priceUSD,
      marketCap: stats.marketCapUSD,
      "24hChange": stats.change24h
    };
  } catch (error) {
    console.error(`Error getting latest stats for ${coin}:`, error);
    throw error;
  }
};

/**
 * Calculate standard deviation of price for a specific coin
 * @param {string} coin - Coin ID
 * @returns {Promise<number>} - Standard deviation
 */
const getPriceDeviation = async (coin) => {
  try {
    const stats = await CryptoStats.find({ coin })
      .sort({ timestamp: -1 })
      .limit(100)
      .select('priceUSD')
      .lean();
    
    if (!stats || stats.length === 0) {
      throw new Error(`No stats found for ${coin}`);
    }

    const prices = stats.map(stat => stat.priceUSD);
    const deviation = calculateStandardDeviation(prices);
    
    return deviation;
  } catch (error) {
    console.error(`Error calculating price deviation for ${coin}:`, error);
    throw error;
  }
};

module.exports = {
  storeCryptoStats,
  getLatestStats,
  getPriceDeviation
};