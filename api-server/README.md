# Crypto Stats API Server

This server provides APIs for retrieving cryptocurrency statistics and calculates statistical data based on historical records.

## Features

- Fetch and store cryptocurrency stats from CoinGecko API
- Provide latest stats via `/stats` endpoint
- Calculate standard deviation of prices via `/deviation` endpoint
- Subscribe to NATS events from the worker server to update data

## Requirements

- Node.js (v14 or higher)
- MongoDB
- NATS Server

## Setup Instructions

1. Clone the repository
2. Navigate to the `api-server` directory
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file based on `.env.example`:
   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/crypto-stats
   NATS_URL=nats://localhost:4222
   ```
5. Start the server:
   ```
   npm start
   ```
   For development with auto-restart:
   ```
   npm run dev
   ```

## API Endpoints

### GET /stats

Get the latest statistics for a cryptocurrency.

**Query Parameters:**
- `coin` (required): One of `bitcoin`, `ethereum`, or `matic-network`

**Response:**
```json
{
  "price": 40000,
  "marketCap": 800000000,
  "24hChange": 3.4
}
```

### GET /deviation

Get the standard deviation of the price for the last 100 records of a cryptocurrency.

**Query Parameters:**
- `coin` (required): One of `bitcoin`, `ethereum`, or `matic-network`

**Response:**
```json
{
  "deviation": 4082.48
}
```

### GET /health

Check if the server is running.

**Response:**
```json
{
  "status": "ok"
}
```

## Architecture

- **MongoDB Model**: Structured to store cryptocurrency data with timestamps
- **Services**: Handle business logic and API interactions
- **Controllers**: Handle HTTP requests/responses
- **NATS Client**: Subscribes to events from the worker server

## Production Deployment

For production deployment:

1. Set up a MongoDB Atlas cluster
2. Deploy the server to a cloud platform (Heroku, AWS, GCP, Azure)
3. Configure environment variables on the cloud platform
4. Ensure NATS server is accessible from both the API and worker servers