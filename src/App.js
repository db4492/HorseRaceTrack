import React, { useState, useEffect, useCallback } from 'react';
import RaceTrack from './components/RaceTrack';
import BettingPanel from './components/BettingPanel';
import './App.css';

function App() {
  const [balance, setBalance] = useState(1000);
  const [isRacing, setIsRacing] = useState(false);
  const [winner, setWinner] = useState(null);
  const [bettingHistory, setBettingHistory] = useState([]);

  const generateHorseName = useCallback(() => {
    // Move the word banks inside the callback
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
  }, []); // No dependencies needed now

  const generateHorses = useCallback(() => {
    const horses = [];
    const usedNames = new Set();

    for (let i = 0; i < 8; i++) {
      let name;
      do {
        name = generateHorseName();
      } while (usedNames.has(name));
      
      usedNames.add(name);
      // Generate random stats between 1-100
      const stats = {
        speed: Math.floor(Math.random() * 100) + 1,
        stamina: Math.floor(Math.random() * 100) + 1,
        acceleration: Math.floor(Math.random() * 100) + 1,
        luck: Math.floor(Math.random() * 100) + 1
      };
      
      // Calculate odds based on stats
      const statAverage = (stats.speed + stats.stamina + stats.acceleration + stats.luck) / 4;
      const odds = Math.max(1.5, (6 - (statAverage / 25))).toFixed(1);

      horses.push({
        id: i + 1,
        name: name,
        odds: parseFloat(odds),
        stats: stats
      });
    }
    return horses;
  }, [generateHorseName]);

  const [horses, setHorses] = useState(() => generateHorses());

  // Regenerate horses after each race
  useEffect(() => {
    if (!isRacing) {
      const timer = setTimeout(() => {
        setHorses(generateHorses());
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isRacing, generateHorses]);

  const handleBet = (horseId, amount) => {
    if (amount <= balance && !isRacing) {
      setBalance(prev => prev - amount);
      setIsRacing(true);
      
      // Calculate weighted chances based on stats
      const totalWeights = horses.map(horse => {
        const stats = horse.stats;
        // Weight calculation using all stats
        return (stats.speed * 0.4) + // Speed is most important
               (stats.stamina * 0.3) + // Stamina second most important
               (stats.acceleration * 0.2) + // Acceleration third
               (stats.luck * 0.1); // Luck has smallest impact
      });

      // Convert weights to probabilities
      const totalWeight = totalWeights.reduce((a, b) => a + b, 0);
      const probabilities = totalWeights.map(weight => weight / totalWeight);

      // Select winner based on weighted probabilities
      const random = Math.random();
      let cumulativeProbability = 0;
      let winner = horses[0];

      for (let i = 0; i < horses.length; i++) {
        cumulativeProbability += probabilities[i];
        if (random <= cumulativeProbability) {
          winner = horses[i];
          break;
        }
      }
      
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