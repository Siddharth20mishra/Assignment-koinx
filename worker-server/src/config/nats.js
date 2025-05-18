const { connect } = require('nats');
require('dotenv').config();

let nc = null;

const connectNATS = async () => {
  try {
    nc = await connect({ servers: process.env.NATS_URL });
    console.log('Connected to NATS');
    return nc;
  } catch (error) {
    console.error('NATS connection error:', error.message);
    process.exit(1);
  }
};

const getNATSConnection = () => {
  if (!nc) {
    throw new Error('NATS not connected');
  }
  return nc;
};

module.exports = { connectNATS, getNATSConnection };