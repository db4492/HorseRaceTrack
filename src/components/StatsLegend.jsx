import React, { useState } from 'react';
import './StatsLegend.css';

export default function StatsLegend() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <button 
        className="stats-guide-button"
        onClick={() => setIsVisible(true)}
      >
        📊 Stats Guide
      </button>

      {isVisible && (
        <div className="stats-guide-overlay">
          <div className="stats-guide-panel">
            <div className="stats-guide-header">
              <h3>Horse Stats Guide</h3>
              <button 
                className="close-button"
                onClick={() => setIsVisible(false)}
              >
                ×
              </button>
            </div>
            <div className="stats-guide-content">
              <div className="stat-item">
                <span className="stat-icon">⚡</span>
                <div className="stat-details">
                  <h4>Speed</h4>
                  <p>Maximum velocity a horse can achieve during the race</p>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">💪</span>
                <div className="stat-details">
                  <h4>Stamina</h4>
                  <p>Horse's ability to maintain speed over the race distance</p>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🚀</span>
                <div className="stat-details">
                  <h4>Acceleration</h4>
                  <p>How quickly a horse reaches its top speed</p>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🍀</span>
                <div className="stat-details">
                  <h4>Luck</h4>
                  <p>Random chance of performing above expectations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 