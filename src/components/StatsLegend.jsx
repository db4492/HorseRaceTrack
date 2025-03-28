import React, { useState } from 'react';
import './StatsLegend.css';

export default function StatsLegend() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="stats-legend-container">
      <button 
        className="legend-toggle" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        📊 {isExpanded ? 'Hide' : 'Show'} Stats Guide
      </button>
      
      {isExpanded && (
        <div className="stats-legend-box">
          <div className="legend-item">
            <span className="stat-name">⚡ Speed</span>
            <p>Maximum race velocity</p>
          </div>
          <div className="legend-item">
            <span className="stat-name">💪 Stamina</span>
            <p>Maintains speed over distance</p>
          </div>
          <div className="legend-item">
            <span className="stat-name">🚀 Acceleration</span>
            <p>Time to reach top speed</p>
          </div>
          <div className="legend-item">
            <span className="stat-name">🍀 Luck</span>
            <p>Chance of outperforming</p>
          </div>
        </div>
      )}
    </div>
  );
} 