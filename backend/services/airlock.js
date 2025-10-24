const express = require('express');
const cors = require('cors');
const Redis = require('ioredis');

module.exports = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  const enabled = process.env.ENABLED === 'true';

  const redis = !enabled && new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD
  });

  // Set default airlock status and timestamp if not already set
  async function initializeAirlock() {
    if (!enabled) return;
    const status = await redis.hget("airlock", "status");
    if (!status) {
      await redis.hset("airlock", "status", "closed", "last_change", new Date().toISOString());
    }
  }
  initializeAirlock();

  // Get current airlock status with timestamp
  app.get('/api/airlock', async (req, res) => {
    if (!enabled) {
      return res.json({
        airlock_status: "disabled",
        last_change: new Date().toISOString()
      });
    }

    const airlockData = await redis.hgetall("airlock");
    res.json({
      airlock_status: airlockData.status || "closed",
      last_change: airlockData.last_change || new Date().toISOString()
    });
  });

  // Change airlock status and update timestamp
  app.post('/api/airlock', async (req, res) => {
    const { command } = req.body;
    console.info(`Airlock received command: ${command}`);
    if (!["open", "close"].includes(command)) {
      return res.status(400).json({ error: 'Invalid command. Use "open" or "close".' });
    }

    if (!enabled) {
      return res.status(400).json({ error: 'Airlock is disabled. Command not executed.' });
    }

    const timestamp = new Date().toISOString();
    await redis.hset("airlock", "status", command, "last_change", timestamp);

    res.json({
      airlock_status: command,
      last_change: timestamp,
      message: `Airlock is now ${command}.`
    });
  });

  return app;
};
