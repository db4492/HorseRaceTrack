import React from 'react';
import './Achievements.css';

const achievementsList = {
  firstWin: {
    title: "Beginner's Luck",
    description: "Won your first race!",
    icon: "🎯"
  },
  bigWinner: {
    title: "Horse Whisperer",
    description: "Won more than 5x your bet",
    icon: "🤫"
  },
  luckyStreak: {
    title: "Lucky Duck",
    description: "Won 3 races in a row",
    icon: "🦆"
  },
  highRoller: {
    title: "Money Bags",
    description: "Bet over $500 in one race",
    icon: "💰"
  },
  weatherMaster: {
    title: "Storm Chaser",
    description: "Won during stormy weather",
    icon: "⛈️"
  },
  comeback: {
    title: "Phoenix Rising",
    description: "Won after losing 5 times",
    icon: "🔥"
  },
  jackpot: {
    title: "Golden Horseshoe",
    description: "Won over $1000 in one race",
    icon: "🏆"
  },
  underdog: {
    title: "Dark Horse",
    description: "Won with the lowest odds",
    icon: "🐎"
  }
};

function Achievements({ achievements, onClose }) {
  return (
    <div className="achievements-panel">
      <div className="achievements-header">
        <h3>🏆 Achievements</h3>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      <div className="achievements-grid">
        {Object.entries(achievementsList).map(([key, achievement]) => {
          const isUnlocked = achievements.includes(key);
          return (
            <div 
              key={key} 
              className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="achievement-icon">{achievement.icon}</div>
              <div className="achievement-info">
                <h4>{achievement.title}</h4>
                <p>{achievement.description}</p>
              </div>
              {!isUnlocked && <div className="locked-overlay">🔒</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Achievements; 