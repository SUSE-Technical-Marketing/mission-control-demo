const express = require('express');
const cors = require('cors');
const dns = require('node:dns');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

module.exports = () => {

    const app = express();
    app.use(cors());

    const instabilityFactor = process.env.INSTABILITY_FACTOR ? parseFloat(process.env.INSTABILITY_FACTOR) : 0.3; // 30% chance of instability

    const POWER_CORE_ID = uuidv4(); // Generate a unique identifier for each Power Core instance
    let powerStatus = { status: "stable", message: "Power levels nominal." }; // Default state

    // Function to change power status every 30 seconds
    function updatePowerStatus() {
        const isUnstable = Math.random() < instabilityFactor;
        powerStatus = isUnstable
            ? { status: "unstable", message: "Power fluctuations detected!" }
            : { status: "stable", message: "Power levels nominal." };

        if (isUnstable) {
            console.log(`ERROR: [${POWER_CORE_ID}] ${powerStatus.message}!`);
        } else {
            console.log(`[${POWER_CORE_ID}] ${powerStatus.message}!`);
        }
    }

    // Update power status every 60 seconds
    setInterval(updatePowerStatus, 60000);

    async function getAllPowerCoreStatuses() {
        return new Promise((resolve) => {
            dns.resolveSrv('power-core-headless-service.mission-control.svc.cluster.local', async (err, records) => {
                if (err) {
                    console.error("Error resolving Power Core instances:", err);
                    return resolve([]);
                }

                const instances = records.map(record => record.name);
                const coreStatuses = await Promise.all(instances.map(async (instance) => {
                    try {
                        const response = await axios.get(`http://${instance}:3000/api/power-core/status`);
                        return response.data;
                    } catch (error) {
                        console.log(`ERROR: Unable to reach Power Core instance [${instance}]: ${error}`);
                        return { id: instance, status: "unknown", message: "Unreachable" };
                    }
                }));

                resolve(coreStatuses);
            });
        });
    }

    // API to get all power core statuses
    app.get('/api/power-core/all', async (req, res) => {
        console.log(`[${POWER_CORE_ID}] Requesting all Power Core statuses...`);
        const powerCores = await getAllPowerCoreStatuses();
        res.json(powerCores);
    });

    // API to get power core status
    app.get('/api/power-core/status', (req, res) => {
        console.log(`[${POWER_CORE_ID}] Requesting Power Core status...`);
        res.json({ id: POWER_CORE_ID, ...powerStatus });
    });

    app.get('/api/power-core/health', (req, res) => {
        if (powerStatus.status === "unstable") {
            return res.status(503).json({ status: 'unhealthy' });
        } else {
            res.json({ status: 'healthy' });
        }
    });

    return app;
};
