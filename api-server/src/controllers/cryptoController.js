const cryptoService = require('../services/cryptoService');

/**
 * Get latest stats for a cryptocurrency
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getStats = async (req, res) => {
  try {
    const { coin } = req.query;
    
    if (!coin || !['bitcoin', 'ethereum', 'matic-network'].includes(coin)) {
      return res.status(400).json({ 
        error: 'Invalid coin. Must be one of: bitcoin, ethereum, matic-network'
      });
    }

    const stats = await cryptoService.getLatestStats(coin);
    res.json(stats);
  } catch (error) {
    console.error('Error in getStats controller:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

/**
 * Get price deviation for a cryptocurrency
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDeviation = async (req, res) => {
  try {
    const { coin } = req.query;
    
    if (!coin || !['bitcoin', 'ethereum', 'matic-network'].includes(coin)) {
      return res.status(400).json({ 
        error: 'Invalid coin. Must be one of: bitcoin, ethereum, matic-network'
      });
    }

    const deviation = await cryptoService.getPriceDeviation(coin);
    res.json({ deviation });
  } catch (error) {
    console.error('Error in getDeviation controller:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

module.exports = {
  getStats,
  getDeviation
};