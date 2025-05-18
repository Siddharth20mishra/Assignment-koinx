require('dotenv').config();
const { connectNATS } = require('./config/nats');
const { startCronJob } = require('./jobs/cronJob');

const startServer = async () => {
  try {
    // Connect to NATS
    await connectNATS();

    // Start cron job
    startCronJob();

    console.log('Worker server started');
  } catch (error) {
    console.error('Failed to start worker server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down worker server...');
  process.exit(0);
});

startServer();