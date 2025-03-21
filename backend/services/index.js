require('./tracing');

const express = require('express');
const powerCore = require('./power-core');

const serviceType = process.env.SERVICE;
const services = {
  gravity: require('./gravity'),
  lifeSupport: require('./life-support'),
  airlock: require('./airlock'),
  powerCore: require('./power-core')
};

if (!serviceType || !services[serviceType]) {
  console.error(`Invalid or missing SERVICE environment variable. Available options: ${Object.keys(services).join(', ')}`);
  process.exit(1);
}

const app = services[serviceType]();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`${serviceType} service running on http://localhost:${port}`);
});
