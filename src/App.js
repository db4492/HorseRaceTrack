import React, { useState, useEffect, useCallback } from 'react';
import RaceTrack from './components/RaceTrack';
import BettingPanel from './components/BettingPanel';
import StatsLegend from './components/StatsLegend';
import './App.css';

function App() {
  // First define the weather types
  const weatherTypes = {
    sunny: { name: "Sunny", icon: "☀️", effect: "Normal racing conditions" },
    rainy: { name: "Rainy", icon: "🌧️", effect: "Slows down all horses, but high stamina horses perform better" },
    windy: { name: "Windy", icon: "💨", effect: "Faster race times, but lower acceleration" },
    stormy: { name: "Stormy", icon: "⛈️", effect: "Unpredictable performance, luck matters more" },
    cloudy: { name: "Cloudy", icon: "☁️", effect: "Balanced conditions" }
  };

  // Then define the generate weather function
  const generateWeather = () => {
    const conditions = Object.keys(weatherTypes);
    const randomWeather = conditions[Math.floor(Math.random() * conditions.length)];
    return weatherTypes[randomWeather];
  };

  // Now we can use it in useState
  const [weather, setWeather] = useState(generateWeather());
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

  // Update horse performance based on weather
  // const calculateWeatherEffect = (horse, weather) => {
  //   const stats = { ...horse.stats };
    
  //   switch(weather.name) {
  //     case "Rainy":
  //       stats.speed *= 0.9;
  //       stats.stamina *= 1.2;
  //       break;
  //     case "Windy":
  //       stats.speed *= 1.2;
  //       stats.acceleration *= 0.8;
  //       break;
  //     case "Stormy":
  //       stats.luck *= 1.5;
  //       stats.speed *= 0.8;
  //       break;
  //     case "Cloudy":
  //       // No effect
  //       break;
  //     default:
  //       // Sunny - slight boost to all stats
  //       stats.speed *= 1.1;
  //       stats.stamina *= 1.1;
  //       stats.acceleration *= 1.1;
  //   }
    
  //   return stats;
  // };

  const handleBet = (horseId, amount) => {
    if (amount <= balance && !isRacing) {
      setBalance(prev => prev - amount);
      setIsRacing(true);
      
      const winner = horses[Math.floor(Math.random() * horses.length)];
      setWinner(winner);
      
      setTimeout(() => {
        const didWin = winner.id === horseId;
        const winnings = didWin ? amount * horses.find(h => h.id === horseId).odds : 0;
        
        setBettingHistory(prev => [{
          id: Date.now(),
          horseName: horses.find(h => h.id === horseId).name,
          amount: amount,
          winnings: winnings,
          winner: winner.name,
          winnerStats: winner.stats,
          didWin: didWin,
          timestamp: new Date().toLocaleTimeString(),
          weather: weather.name,
          weatherIcon: weather.icon
        }, ...prev].slice(0, 10));

        if (didWin) {
          setBalance(prev => prev + winnings);
          alert(`You won $${winnings}!`);
        } else {
          alert(`You lost! ${winner.name} won the race.`);
        }
        
        setWeather(generateWeather());
        setIsRacing(false);
        setTimeout(() => setWinner(null), 2000);
      }, 3000);
    }
  };

  return (
    <div className="App">
      <h1>Horse Race Betting</h1>
      <h2>Balance: ${balance}</h2>
      
      {/* Add the legend after the header */}
      <StatsLegend />
      
      {weather && (
        <div className="weather-info">
          <h3>{weather.icon} {weather.name} Conditions</h3>
          <p>{weather.effect}</p>
        </div>
      )}

      <RaceTrack 
        horses={horses} 
        isRacing={isRacing} 
        winner={winner}
        weather={weather}
      />
      <BettingPanel 
        horses={horses} 
        onBet={handleBet} 
        disabled={isRacing}
        bettingHistory={bettingHistory}
        weather={weather}
      />
    </div>
  );
}

export default App; 