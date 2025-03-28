import React from 'react';
import './HorseStats.css';

function HorseStats({ stats, personality }) {
  const getStatColor = (value) => {
    if (value >= 80) return '#4CAF50';
    if (value >= 60) return '#8BC34A';
    if (value >= 40) return '#FFC107';
    if (value >= 20) return '#FF9800';
    return '#F44336';
  };

  return (
    <div className="horse-stats">
      {/* Add console log to debug */}
      {console.log('Personality in HorseStats:', personality)}
      
      {/* Show personality at the top if it exists */}
      {personality && (
        <div className="personality-row">
          <span className="personality-trait">
            {personality.icon} {personality.trait}
          </span>
        </div>
      )}

      {/* Show regular stats */}
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