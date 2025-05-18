const express = require('express');
const cors = require('cors');
const { getNATSConnection } = require('./config/nats');
const cryptoService = require('./services/cryptoService');
const cryptoController = require('./controllers/cryptoController');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/stats', cryptoController.getStats);
app.get('/deviation', cryptoController.getDeviation);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const setupSubscription = async () => {
  try {
    const nc = getNATSConnection();
    const subscription = nc.subscribe('crypto.update');
    
    console.log('Subscribed to crypto.update');
    
    (async () => {
      for await (const msg of subscription) {
        try {
          const data = JSON.parse(msg.data.toString());
          console.log('Received event:', data);
          
          if (data.trigger === 'update') {
            console.log('Triggering crypto stats update');
            await cryptoService.storeCryptoStats();
          }
        } catch (error) {
          console.error('Error processing NATS message:', error);
        }
      }
    })();
    
    return;
  } catch (error) {
    console.error('Error setting up NATS subscription:', error);
  }
};

module.exports = { app, setupSubscription };