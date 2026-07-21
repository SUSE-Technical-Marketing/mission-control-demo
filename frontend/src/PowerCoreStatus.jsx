import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PowerCoreStatus = () => {
    const [powerCores, setPowerCores] = useState({});

    useEffect(() => {
        const fetchPowerCores = () => {
            fetch('/api/power-core/all')
                .then(response => response.json())
                .then(data => {
                    // Check for unstable cores and show alerts
                    data.forEach(core => {
                        if (core.status === "unstable") {
                            toast.error(`⚠️ Power Core ${core.id.substring(0, 8)} is UNSTABLE!`, {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                theme: "dark",
                            });
                        }
                    });

                    setPowerCores(data);
                })
                .catch(error => console.error("Error fetching power core statuses:", error));
        };

        fetchPowerCores(); // Initial fetch
        const interval = setInterval(fetchPowerCores, 10000); // Refresh every 10 sec

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="status-card">
            <h2>Power Core Status</h2>
            {Object.entries(powerCores).map(([id, core]) => (
                <p key={id} className={core.status === "unstable" ? "unstable" : "stable"}>
                    Core {id.substring(0, 8)}: <strong>{core.status.toUpperCase()}</strong> - {core.message}
                </p>
            ))}
        </div>
    );
};

export default PowerCoreStatus;
