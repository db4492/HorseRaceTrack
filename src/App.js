import React, { useState, useEffect, useCallback } from 'react';
import RaceTrack from './components/RaceTrack';
import BettingPanel from './components/BettingPanel';
import './App.css';

function App() {
  const [balance, setBalance] = useState(1000);
  const [isRacing, setIsRacing] = useState(false);
  const [winner, setWinner] = useState(null);
  const [bettingHistory, setBettingHistory] = useState([]);

  // Expanded word banks for name generation
  const adjectives = [
    "Cosmic", "Midnight", "Thunder", "Lightning", "Mystic", "Crazy", 
    "Dizzy", "Turbo", "Quantum", "Pixel", "Glitch", "Neon", "Laser",
    "Rocket", "Chaos", "Disco", "Ninja", "Zombie", "Viking", "Pirate",
    "Cyber", "Psycho", "Mega", "Ultra", "Hyper", "Retro", "Plasma",
    "Nuclear", "Dragon", "Ghost", "Savage", "Disco", "Rainbow", "Metal",
    "Space", "Time", "Storm", "Nebula", "Galactic", "Techno", "Wizard"
  ];

  const actions = [
    "Dancer", "Sprinter", "Drifter", "Climber", "Surfer", "Jumper",
    "Warrior", "Racer", "Crusher", "Dasher", "Prancer", "Zoomer",
    "Slider", "Glider", "Hopper", "Runner", "Charger", "Blazer",
    "Smasher", "Blaster", "Ninja", "Dazzler", "Sparkler", "Brawler",
    "Bouncer", "Rusher", "Crasher", "Basher", "Slasher", "Zapper",
    "Ripper", "Raver", "Rager", "Rocker", "Rebel", "Phantom"
  ];

  const descriptors = [
    "of Doom", "of Glory", "Supreme", "Ultimate", "Master", "Champion",
    "Legend", "Beast", "Machine", "Prime", "Elite", "Extreme",
    "Maverick", "Prodigy", "Phenomenon", "Wonder", "Mastermind",
    "of Chaos", "of Thunder", "Infinity", "Maximum", "Ultra",
    "of Mystery", "of Power", "Unleashed", "Evolved", "Ascended",
    "of Light", "of Darkness", "Eternal", "Unstoppable", "Invincible"
  ];

  // Function to generate a random horse name
  const generateHorseName = () => {
    const namePatterns = [
      // Pattern 1: Adjective + Action
      () => `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${actions[Math.floor(Math.random() * actions.length)]}`,
      // Pattern 2: Action + Descriptor
      () => `${actions[Math.floor(Math.random() * actions.length)]} ${descriptors[Math.floor(Math.random() * descriptors.length)]}`,
      // Pattern 3: Adjective + Action + Descriptor
      () => `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${actions[Math.floor(Math.random() * actions.length)]} ${descriptors[Math.floor(Math.random() * descriptors.length)]}`,
      // Pattern 4: Just funny combinations
      () => {
        const funnyPrefixes = ["Sir", "Captain", "Doctor", "Professor", "Lord"];
        return `${funnyPrefixes[Math.floor(Math.random() * funnyPrefixes.length)]} ${actions[Math.floor(Math.random() * actions.length)]}`;
      }
    ];

    const pattern = namePatterns[Math.floor(Math.random() * namePatterns.length)];
    return pattern();
  };

  // Generate horses with random names and odds
  const generateHorses = useCallback(() => {
    const horses = [];
    const usedNames = new Set();

    for (let i = 0; i < 8; i++) {
      let name;
      do {
        name = generateHorseName();
      } while (usedNames.has(name)); // Ensure unique names
      
      usedNames.add(name);
      horses.push({
        id: i + 1,
        name: name,
        odds: (Math.floor(Math.random() * 35) + 15) / 10 // Random odds between 1.5 and 5.0
      });
    }
    return horses;
  }, []);

  const [horses, setHorses] = useState(() => generateHorses());

  // Regenerate horses after each race
  useEffect(() => {
    if (!isRacing) {
      const timer = setTimeout(() => {
        setHorses(generateHorses());
      }, 2000); // Wait for horses to return to start
      return () => clearTimeout(timer);
    }
  }, [isRacing, generateHorses]);

  const handleBet = (horseId, amount) => {
    if (amount <= balance && !isRacing) {
      setBalance(prev => prev - amount);
      setIsRacing(true);
      
      const winner = horses[Math.floor(Math.random() * horses.length)];
      setWinner(winner);
      
      setTimeout(() => {
        const didWin = winner.id === horseId;
        const winnings = didWin ? amount * horses.find(h => h.id === horseId).odds : 0;
        
        // Add bet to history
        setBettingHistory(prev => [{
          id: Date.now(),
          horseName: horses.find(h => h.id === horseId).name,
          amount: amount,
          winnings: winnings,
          winner: winner.name,
          didWin: didWin,
          timestamp: new Date().toLocaleTimeString()
        }, ...prev].slice(0, 10)); // Keep last 10 bets

        if (didWin) {
          setBalance(prev => prev + winnings);
          alert(`You won $${winnings}!`);
        } else {
          alert(`You lost! ${winner.name} won the race.`);
        }
        setIsRacing(false);
        setTimeout(() => setWinner(null), 2000);
      }, 3000);
    }
  };

  return (
    <div className="App">
      <h1>Horse Race Betting</h1>
      <h2>Balance: ${balance}</h2>
      <RaceTrack 
        horses={horses} 
        isRacing={isRacing} 
        winner={winner}
      />
      <BettingPanel 
        horses={horses} 
        onBet={handleBet} 
        disabled={isRacing}
        bettingHistory={bettingHistory}
      />
    </div>
  );
}

export default App; 