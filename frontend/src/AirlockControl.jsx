import React, { useState, useEffect } from 'react';
import StatusCard from "./StatusCard";

const AirlockControl = () => {
    const [airlock, setAirlock] = useState(null);

    // Fetch airlock status from the API
    useEffect(() => {
        const fetchStatus = () => {
            fetch('/api/airlock')
                .then(response => response.json())
                .then(data => setAirlock(data))
                .catch(error => console.error("Error fetching airlock status:", error));
        };

        fetchStatus(); // Initial fetch
        const interval = setInterval(fetchStatus, 5000); // Poll every 5 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    const toggleAirlock = () => {
        // Optimistically update UI first
        const newStatus = airlock?.airlock_status === "open" ? "close" : "open";
        setAirlock(prev => ({ ...prev, airlock_status: newStatus }));

        // Send request to backend
        fetch('/api/airlock', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ command: newStatus })
        })
        .then(response => response.json())
        .then(data => setAirlock(data))  // ✅ Update with real response from API
        .catch(error => {
            console.error("Error updating airlock:", error);
            // Revert state in case of error
            setAirlock(prev => ({ ...prev, airlock_status: airlock?.airlock_status }));
        });
    };

    return (
        <div className="airlock-container">
            <StatusCard
                title="Airlock"
                value={airlock?.airlock_status === "open" ? "Open" : "Closed"}
                status={airlock?.airlock_status === "open" ? "alert" : "nominal"}
            />
            <p>Last Change: {airlock?.last_change ? new Date(airlock.last_change).toLocaleString() : "N/A"}</p>
            <button className={`neon-button ${airlock?.airlock_status === "open" ? "neon-green" : ""}`} onClick={toggleAirlock}>
                { airlock?.airlock_status === "open" ? "Close" : "Open" } Airlock 🚀
            </button>
        </div>
    );
};

export default AirlockControl;
