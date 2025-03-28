import React, { useEffect, useState } from 'react';
import './RaceTrack.css';
import HorseStats from './HorseStats';

function RaceTrack({ horses, isRacing, winner, weather }) {
  const [positions, setPositions] = useState({});
  const [raceFinished, setRaceFinished] = useState(false);
  const [surface] = useState(Math.random() < 0.5 ? 'grass' : 'dirt');
  
  // Add color assignment when horses are rendered
  const horseColors = ['white', 'brown', 'black', 'grey'];
  
  useEffect(() => {
    if (isRacing) {
      setPositions({});
      setRaceFinished(false);
      let progress = 0;
      const totalFrames = 60;

      const interval = setInterval(() => {
        progress++;
        
        setPositions(prev => {
    
  
          const newPositions = { ...prev };
          const isNearFinish = progress > (totalFrames * .75);
          
          horses.forEach(horse => {
            // Base progress goes from 0 to 100
            const baseProgress = (progress / totalFrames) * 100;
            const variation = (Math.random() - 0.5) * 1.5;
            
            if (horse.id === winner?.id && isNearFinish) {
              // Winner reaches full 100%
              const winnerBoost = ((progress - (totalFrames * 0.5)) / totalFrames) * 5;
              newPositions[horse.id] = Math.min(100, baseProgress + variation + winnerBoost);
            } else {
              // Other horses reach close to finish
              newPositions[horse.id] = Math.min(98, baseProgress + variation);
            }
          });
          return newPositions;
        });

        if (progress >= totalFrames) {
          clearInterval(interval);
          setRaceFinished(true);
        }
      }, 50);

      return () => clearInterval(interval);
    } else {
      const returnInterval = setInterval(() => {
        setPositions(prev => {
          const newPositions = { ...prev };
          let allReturned = true;
          
          horses.forEach(horse => {
            if (newPositions[horse.id] > 0) {
              newPositions[horse.id] = Math.max(0, newPositions[horse.id] - 2);
              allReturned = false;
            }
          });
          
          if (allReturned) {
            clearInterval(returnInterval);
            setRaceFinished(false);
          }
          
          return newPositions;
        });
      }, 50);

      return () => clearInterval(returnInterval);
    }
  }, [isRacing, horses, winner]);

  return (
    <div className={`race-track ${surface} ${weather?.name.toLowerCase()}`}>
      <div className="surface-label">
        {surface.charAt(0).toUpperCase() + surface.slice(1)} Track 
        {weather && ` • ${weather.icon}`}
      </div>
      <div className="track-container">
        {horses.map((horse, index) => (
          <div key={horse.id} className={`track-lane ${surface}`}>
            <div className="name-section">
              <span className="horse-name">
                <span className="stats-indicator">📊</span>
                {' '}{horse.name}
              </span>
              <div className="stats-popup">
                <HorseStats stats={horse.stats} />
              </div>
            </div>
            <div className="race-section">
              <div 
                className={`horse-emoji ${horseColors[index % horseColors.length]} ${raceFinished && winner?.id === horse.id ? 'winner' : ''}`}
                style={{ 
                  left: `${positions[horse.id] || 0}%`,
                  transition: 'left 0.05s linear'
                }}
              >
                🐎
              </div>
            </div>
          </div>
        ))}
        <div className="checkered-finish">
          <div className="finish-label">FINISH</div>
        </div>
        <div className="starting-line">
          <div className="start-label">START</div>
        </div>
      </div>
    </div>
  );
}

export default RaceTrack;