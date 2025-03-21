const express = require('express');
const cors = require("cors");

module.exports = () => {
  const app = express();
  app.use(cors({
    origin: "*",  // Allow all origins (or use a specific domain)
    methods: ["GET", "POST"]
}));
  app.get('/api/gravity', (req, res) => {
    const gravityLevel = (0.9 + Math.random() * 0.2).toFixed(2);
    const status = gravityLevel >= 1 || gravityLevel <= 0.8 ? 'alert' : 'nominal';
    res.json({ gravity_level: gravityLevel, unit: 'g', status: status });
  });
  return app;
};
