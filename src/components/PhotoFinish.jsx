import React from 'react';
import './PhotoFinish.css';

function PhotoFinish({ isVisible, winner, secondPlace }) {
  if (!isVisible) return null;

  return (
    <div className="photo-finish-overlay">
      <div className="photo-finish-content">
        <div className="photo-strip">
          <div className="finish-horse winner">
            🐎 {winner.name}
          </div>
          <div className="finish-horse runner-up">
            🐎 {secondPlace.name}
          </div>
        </div>
        <div className="photo-label">
          📸 PHOTO FINISH!
          <div className="margin">Winning margin: 0.1 seconds</div>
        </div>
      </div>
    </div>
  );
}

export default PhotoFinish; 