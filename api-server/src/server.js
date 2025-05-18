require('dotenv').config();
const { app, setupSubscription } = require('./app');
const connectDB = require('./config/db');
const { connectNATS } = require('./config/nats');
const cryptoService = require('./services/cryptoService');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Connect to NATS
    await connectNATS();

    // Set up NATS subscription
    await setupSubscription();

    // Load initial data if needed
    await cryptoService.storeCryptoStats();
    console.log('Initial crypto stats stored');

    // Start Express server
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down api-server...');
  process.exit(0);
});

startServer();