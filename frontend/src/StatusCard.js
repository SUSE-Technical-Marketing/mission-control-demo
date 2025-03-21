import React from 'react';

const StatusCard = ({ title, value, status }) => {
    return (
        <div className={`status-card ${status === "alert" ? "status-alert" : ""}`}>
            <div className="status-title">{title}</div>
            <div className={`status-value ${status === "alert" ? "status-alert" : ""}`}>{value}</div>
        </div>
    );
};

export default StatusCard;
