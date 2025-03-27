import React, { useState } from 'react';
import './BettingPanel.css';

function BettingPanel({ horses, onBet, disabled, bettingHistory }) {
  const [selectedHorse, setSelectedHorse] = useState(null);
  const [betAmount, setBetAmount] = useState(10);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedHorse && betAmount > 0) {
      onBet(selectedHorse, betAmount);
    }
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
                <div className="bet-time">{bet.timestamp}</div>
                <div className="bet-details">
                  Bet ${bet.amount} on {bet.horseName}
                </div>
                <div className="bet-result">
                  {bet.didWin ? (
                    <span className="win-amount">Won ${bet.winnings}</span>
                  ) : (
                    <span className="loss-amount">Lost ${bet.amount} - {bet.winner} won</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BettingPanel; 