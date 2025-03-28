import React from 'react';
import './HorseStats.css';

function HorseStats({ stats }) {
  const getStatColor = (value) => {
    if (value >= 80) return '#4CAF50';
    if (value >= 60) return '#8BC34A';
    if (value >= 40) return '#FFC107';
    if (value >= 20) return '#FF9800';
    return '#F44336';
  };

  return (
    <div className="horse-stats">
      {Object.entries(stats).map(([stat, value]) => (
        <div key={stat} className="stat-row">
          <span className="stat-label">{stat.charAt(0).toUpperCase() + stat.slice(1)}</span>
          <div className="stat-bar-container">
            <div 
              className="stat-bar" 
              style={{ 
                width: `${value}%`,
                backgroundColor: getStatColor(value)
              }}
            />
            <span className="stat-value">{value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default HorseStats; 