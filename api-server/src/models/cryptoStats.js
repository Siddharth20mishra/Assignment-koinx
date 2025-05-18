const mongoose = require('mongoose');

const CryptoStatsSchema = new mongoose.Schema({
  coin: {
    type: String,
    required: true,
    enum: ['bitcoin', 'ethereum', 'matic-network']
  },
  priceUSD: {
    type: Number,
    required: true
  },
  marketCapUSD: {
    type: Number,
    required: true
  },
  change24h: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Creating a compound index for efficient querying
CryptoStatsSchema.index({ coin: 1, timestamp: -1 });

module.exports = mongoose.model('CryptoStats', CryptoStatsSchema);