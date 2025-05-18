const cron = require('node-cron');
const { getNATSConnection } = require('../config/nats');

/**
 * Publish update event to NATS
 */
const publishUpdateEvent = async () => {
  try {
    const nc = getNATSConnection();
    const message = { trigger: 'update' };
    
    nc.publish('crypto.update', JSON.stringify(message));
    console.log('Published update event:', message);
  } catch (error) {
    console.error('Error publishing update event:', error);
  }
};

/**
 * Start cron job to publish update event every 15 minutes
 */
const startCronJob = () => {
  // Schedule to run every 15 minutes
  cron.schedule('*/15 * * * *', async () => {
    console.log('Running cron job - publishing update event');
    await publishUpdateEvent();
  });
  
  console.log('Cron job scheduled to run every 15 minutes');
  
  // Also run immediately on startup
  publishUpdateEvent();
};

module.exports = { startCronJob };