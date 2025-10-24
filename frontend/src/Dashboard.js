import React, { useEffect, useState } from "react";
import StatusCard from "./StatusCard";
import AirlockControl from "./AirlockControl";
import PowerCoreStatus from "./PowerCoreStatus";

const Dashboard = () => {
  const [gravity, setGravity] = useState(null);
  const [lifeSupport, setLifeSupport] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gravityRes = await fetch(`/api/gravity`);
        const lifeSupportRes = await fetch(`/api/life-support`);

        setGravity(await gravityRes.json());
        setLifeSupport(await lifeSupportRes.json());
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Auto-refresh every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard">
      <div className="status-grid">
        <div className="status-grid">
          <StatusCard
            title="Gravity"
            value={`${gravity?.gravity_level} ${gravity?.unit}`}
            status="nominal"
          />
          <StatusCard
            title="Oxygen Level"
            value={`${lifeSupport?.oxygen_level.value} ${lifeSupport?.oxygen_level.unit}`}
            status={lifeSupport?.oxygen_level.status}
          />
          <StatusCard
            title="CO2 Level"
            value={`${lifeSupport?.co2_level.value} ${lifeSupport?.co2_level.unit}`}
            status={lifeSupport?.co2_level.status}
          />
          <StatusCard
            title="Temperature"
            value={`${lifeSupport?.temperature.value} ${lifeSupport?.temperature.unit}`}
            status={lifeSupport?.temperature.status}
          />
        </div>
        <PowerCoreStatus />
      </div>
      {/* <AirlockControl /> */}
    </div>
  );
};

export default Dashboard;
