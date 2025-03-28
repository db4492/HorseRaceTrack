import React, { useState } from 'react';
import './BettingPanel.css';
import HorseStats from './HorseStats';

function BettingPanel({ horses, onBet, disabled, bettingHistory }) {
  const [selectedHorse, setSelectedHorse] = useState(null);
  const [betAmount, setBetAmount] = useState(10);
  const [expandedBet, setExpandedBet] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedHorse && betAmount > 0) {
      onBet(selectedHorse, betAmount);
    }
  };

  const toggleStats = (betId) => {
    setExpandedBet(expandedBet === betId ? null : betId);
  };

  return (
    <div className="betting-panel">
      <form onSubmit={handleSubmit}>
        <div className="horse-selection">
          {horses.map(horse => (
            <button
              key={horse.id}
              type="button"
              className={`horse-button ${selectedHorse === horse.id ? 'selected' : ''}`}
              onClick={() => setSelectedHorse(horse.id)}
              disabled={disabled}
            >
              {horse.name} (x{horse.odds})
            </button>
          ))}
        </div>
        <div className="bet-amount">
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            min="1"
            disabled={disabled}
          />
          <button type="submit" disabled={!selectedHorse || disabled}>
            Place Bet
          </button>
        </div>
      </form>

      <div className="betting-history">
        <h3>Betting History</h3>
        {bettingHistory.length === 0 ? (
          <p className="no-bets">No bets placed yet</p>
        ) : (
          <div className="history-list">
            {bettingHistory.map(bet => (
              <div key={bet.id} className={`history-item ${bet.didWin ? 'win' : 'loss'}`}>
                <div className="history-main">
                  <span className="history-horse">{bet.horseName}</span>
                  <span className="history-weather">{bet.weatherIcon} {bet.weather}</span>
                  <span className="history-amount">${bet.amount}</span>
                  {bet.didWin ? (
                    <span className="history-winnings">+${bet.winnings}</span>
                  ) : (
                    <span className="history-loss">Lost</span>
                  )}
                </div>
                <div className="history-details">
                  <div className="winner-info">
                    <span>Winner: {bet.winner}</span>
                    <button 
                      className="stats-toggle"
                      onClick={() => toggleStats(bet.id)}
                    >
                      📊 Stats
                    </button>
                  </div>
                  <span className="history-time">{bet.timestamp}</span>
                </div>
                {expandedBet === bet.id && (
                  <div className="winner-stats">
                    <h4>Winning Horse Stats</h4>
                    <HorseStats stats={bet.winnerStats} personality={bet.winnerPersonality} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BettingPanel; 