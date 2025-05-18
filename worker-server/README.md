# Crypto Stats Worker Server

This server runs background jobs to trigger cryptocurrency data updates via NATS events.

## Features

- Runs a scheduled job every 15 minutes
- Publishes update events to NATS for the API server to consume

## Requirements

- Node.js (v14 or higher)
- NATS Server

## Setup Instructions

1. Clone the repository
2. Navigate to the `worker-server` directory
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file based on `.env.example`:
   ```
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

## How It Works

The worker server uses `node-cron` to schedule a job that runs every 15 minutes. When the job runs, it publishes an event to the NATS server with the following payload:

```json
{
  "trigger": "update"
}
```

The API server subscribes to these events and updates the cryptocurrency data in the database when an event is received.

## Architecture

- **Cron Job**: Scheduled using `node-cron` to run every 15 minutes
- **NATS Client**: Publishes events to the NATS server

## Production Deployment

For production deployment:

1. Deploy the server to a cloud platform (Heroku, AWS, GCP, Azure)
2. Configure environment variables on the cloud platform
3. Ensure NATS server is accessible from both the API and worker servers