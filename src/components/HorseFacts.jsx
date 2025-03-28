import React from 'react';
import './HorseFacts.css';

const horseFacts = [
  "Horses can sleep both lying down and standing up! 🐎💤",
  "A horse's teeth take up more space in their head than their brain does! 🦷🧠",
  "Horses can run within hours after being born! 🏃‍♂️💨",
  "Horses can't throw up! Their digestive system is one-way only! 🚫🤢",
  "The fastest recorded speed of a horse was 55 mph! ⚡️🐎",
  "Horses have the largest eyes of any land mammal! 👀",
  "A horse can see nearly 360 degrees at one time! 🔄",
  "Horses drink at least 25 gallons of water a day! 💧",
  "Horses are measured in 'hands' - each hand equals 4 inches! ✋",
  "The first horse evolved around 50 million years ago! It was the size of a dog! 🦕",
  "Horses have excellent night vision! 🌙",
  "A horse's hooves grow about 1/4 inch per month! 👢",
  "Horses can't breathe through their mouth like humans can! 👃",
  "The American Quarter Horse can run faster than a cheetah for short distances! 🏃‍♂️",
  "Horses have a nearly 360-degree field of vision! 👀"
];

function HorseFacts({ isRacing }) {
  const [currentFact, setCurrentFact] = React.useState('');

  React.useEffect(() => {
    if (!isRacing) {
      // Generate new fact when race ends
      const randomFact = horseFacts[Math.floor(Math.random() * horseFacts.length)];
      setCurrentFact(randomFact);
    }
  }, [isRacing]);

  if (isRacing) return null;

  return (
    <div className="horse-fact">
      <div className="fact-content">
        <span className="fact-icon">🎠</span>
        <p>Did you know? {currentFact}</p>
      </div>
    </div>
  );
}

export default HorseFacts; 