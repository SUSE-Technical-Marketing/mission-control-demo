const express = require("express");
const cors = require("cors");
const axios = require("axios");

module.exports = () => {
  const app = express();

  async function checkPowerCore() {
    try {
        const response = await axios.get('http://power-core-service.mission-control.svc.cluster.local:3000/api/power-core/status');
        return response.data.status;
    } catch (error) {
      return { status: "unstable" };
    }
  }

  function determineStatus(value, min, max, criticalMin, criticalMax) {
    if (value < criticalMin || value > criticalMax) return "critical";
    if (value < min || value > max) return "warning";
    return "nominal";
  }

  app.get("/api/life-support", (req, res) => {
    // const powerStatus = await checkPowerCore();
    // if (powerStatus === "unstable") {
    //     return res.status(503).json({ error: "Life Support Sensors Offline - Power Failure!" });
    // }

    const oxygenLevel = (19.5 + Math.random() * 1).toFixed(1); // O₂: 19.5% - 20.5%
    const co2Level = (0.3 + Math.random() * 0.5).toFixed(2); // CO₂: 0.3% - 0.8%
    const temperature = (20 + Math.random() * 5).toFixed(1); // Temp: 20°C - 25°C

    const oxygenStatus = determineStatus(oxygenLevel, 19.5, 20.5, 18.0, 22.0);
    const co2Status = determineStatus(co2Level, 0.3, 0.8, 1.0, 4.0);
    const temperatureStatus = determineStatus(temperature, 20, 25, 15, 30);

    res.json({
      oxygen_level: { value: oxygenLevel, unit: "%", status: oxygenStatus },
      co2_level: { value: co2Level, unit: "%", status: co2Status },
      temperature: {
        value: temperature,
        unit: "°C",
        status: temperatureStatus,
      },
      overall_status:
        oxygenStatus === "critical" ||
        co2Status === "critical" ||
        temperatureStatus === "critical"
          ? "critical"
          : oxygenStatus === "warning" ||
            co2Status === "warning" ||
            temperatureStatus === "warning"
          ? "warning"
          : "nominal",
    });
  });
  return app;
};
