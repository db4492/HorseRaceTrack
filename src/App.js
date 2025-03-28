import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import RaceTrack from './components/RaceTrack';
import BettingPanel from './components/BettingPanel';
import StatsLegend from './components/StatsLegend';
import HorseFacts from './components/HorseFacts';
import Achievements from './components/Achievements';
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
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [audioFiles] = useState(() => {
    const sounds = [
      new Audio('/sounds/first-call.mp3'),
      new Audio('/sounds/first-call2.mp3'),
      new Audio('/sounds/first-call3.mp3')
    ];
    sounds.forEach(sound => sound.preload = 'auto');
    return sounds;
  });

  const personalityTraits = useMemo(() => [
    { trait: "Loves Carrots", icon: "🥕" },
    { trait: "Afraid of Butterflies", icon: "🦋" },
    { trait: "Dreams of Being a Unicorn", icon: "🦄" },
    { trait: "Practices Yoga", icon: "🧘" },
    { trait: "Aspiring Instagram Model", icon: "📸" },
    { trait: "Thinks They're a Dog", icon: "🐕" },
    { trait: "Professional Napper", icon: "💤" },
    { trait: "Addicted to Sugar Cubes", icon: "🧊" },
    { trait: "Secret Opera Singer", icon: "🎭" },
    { trait: "Always Taking Selfies", icon: "🤳" },
    { trait: "Believes They Can Fly", icon: "✈️" },
    { trait: "Watches Too Much TV", icon: "📺" },
    { trait: "Amateur Comedian", icon: "🎤" },
    { trait: "Scared of Own Shadow", icon: "👻" },
    { trait: "Dreams of Beach Vacation", icon: "🏖️" }
  ], []);

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
      const randomTraitIndex = Math.floor(Math.random() * personalityTraits.length);
      const personality = personalityTraits[randomTraitIndex];

      horses.push({
        id: i + 1,
        name: name,
        personality: personality,
        odds: (Math.floor(Math.random() * 35) + 15) / 10,
        stats: {
          speed: Math.floor(Math.random() * 100) + 1,
          stamina: Math.floor(Math.random() * 100) + 1,
          acceleration: Math.floor(Math.random() * 100) + 1,
          luck: Math.floor(Math.random() * 100) + 1
        }
      });
    }
    return horses;
  }, [generateHorseName, personalityTraits]);

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

  const [achievements, setAchievements] = useState([]);
  const [consecutiveWins, setConsecutiveWins] = useState(0);
  const [lossStreak, setLossStreak] = useState(0);
  const [showAchievements, setShowAchievements] = useState(false);

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

  const checkAchievements = (didWin, amount, winnings, weather) => {
    const newAchievements = [...achievements];

    // First win
    if (didWin && !achievements.includes('firstWin')) {
      newAchievements.push('firstWin');
    }

    // Big winner
    if (didWin && winnings >= amount * 5 && !achievements.includes('bigWinner')) {
      newAchievements.push('bigWinner');
    }

    // High roller
    if (amount >= 500 && !achievements.includes('highRoller')) {
      newAchievements.push('highRoller');
    }

    // Weather master
    if (didWin && weather.name === 'Stormy' && !achievements.includes('weatherMaster')) {
      newAchievements.push('weatherMaster');
    }

    // Jackpot
    if (didWin && winnings >= 1000 && !achievements.includes('jackpot')) {
      newAchievements.push('jackpot');
    }

    // Update consecutive wins/losses
    if (didWin) {
      const newConsecutiveWins = consecutiveWins + 1;
      setConsecutiveWins(newConsecutiveWins);
      setLossStreak(0);

      // Lucky streak
      if (newConsecutiveWins >= 3 && !achievements.includes('luckyStreak')) {
        newAchievements.push('luckyStreak');
      }
    } else {
      setConsecutiveWins(0);
      const newLossStreak = lossStreak + 1;
      setLossStreak(newLossStreak);

      // Comeback achievement check will happen on next win
    }

    // If new achievements were earned, update state and show notification
    if (newAchievements.length > achievements.length) {
      setAchievements(newAchievements);
      const newAchievement = newAchievements[newAchievements.length - 1];
      alert(`🏆 Achievement Unlocked: ${achievementsList[newAchievement].title}!`);
    }
  };

  // Add new state for bribe feature
  const [lastBribeTime, setLastBribeTime] = useState(() => {
    const saved = localStorage.getItem('lastBribeTime');
    return saved ? parseInt(saved) : 0;
  });
  const [bribeAvailable, setBribeAvailable] = useState(true);
  const BRIBE_COST = 200; // Cost to bribe jockeys

  // Add function to check if bribe is available
  const checkBribeAvailability = useCallback(() => {
    const now = Date.now();
    const oneDayInMs = 24 * 60 * 60 * 1000;
    const isAvailable = (now - lastBribeTime) >= oneDayInMs;
    setBribeAvailable(isAvailable);
  }, [lastBribeTime]);

  // Check bribe availability on mount and when lastBribeTime changes
  useEffect(() => {
    checkBribeAvailability();
    localStorage.setItem('lastBribeTime', lastBribeTime.toString());
  }, [lastBribeTime, checkBribeAvailability]);

  // Add bribe function
  const handleBribe = () => {
    if (!bribeAvailable) {
      alert("🕒 Bribe not available! The jockeys are still suspicious from last time...");
      return;
    }
    
    if (balance < BRIBE_COST) {
      alert("💰 Not enough money to bribe the jockeys!");
      return;
    }

    const confirmBribe = window.confirm(
      `🤫 Bribe the jockeys for $${BRIBE_COST}? This gives you a 50/50 chance of winning!`
    );

    if (confirmBribe) {
      setBalance(prev => prev - BRIBE_COST);
      setLastBribeTime(Date.now());
      setBribeAvailable(false);
      
      // Set 50/50 chance for next race only
      setBribeActive(true);
      alert("🤝 The jockeys have been convinced... Your next race has a 50/50 chance!");
    }
  };

  // Modify handleBet to include bribe logic
  const handleBet = (horseId, amount) => {
    if (amount <= balance && !isRacing) {
      setBalance(prev => prev - amount);
      setIsRacing(true);
      
      let winner;
      if (bribeActive) {
        // 50/50 chance when bribe is active
        winner = Math.random() < 0.5 ? 
          horses.find(h => h.id === horseId) : // Player's horse wins
          horses.find(h => h.id !== horseId);  // Random other horse wins
        setBribeActive(false); // Reset bribe after use
      } else {
        // Normal random winner selection
        winner = horses[Math.floor(Math.random() * horses.length)];
      }
      
      setWinner(winner);
      
      // Play the bugle call
      const randomAudio = audioFiles[Math.floor(Math.random() * audioFiles.length)];
      randomAudio.currentTime = 0;
      randomAudio.play()
        .catch(error => console.log('Audio playback failed:', error));
      
      setTimeout(() => {
        const didWin = winner.id === horseId;
        const winnings = didWin ? amount * horses.find(h => h.id === horseId).odds : 0;
        
        // Check achievements after determining win/loss
        checkAchievements(didWin, amount, winnings, weather);
        
        // Stop the audio
        randomAudio.pause();
        randomAudio.currentTime = 0;
        
        // Update betting history
        setBettingHistory(prev => [{
          id: Date.now(),
          horseName: horses.find(h => h.id === horseId).name,
          amount: amount,
          winnings: winnings,
          winner: winner.name,
          winnerStats: winner.stats,
          winnerPersonality: winner.personality,
          didWin: didWin,
          timestamp: new Date().toLocaleTimeString(),
          weather: weather.name,
          weatherIcon: weather.icon
        }, ...prev].slice(0, 10));

        if (didWin) {
          setBalance(prev => prev + winnings);
          if (winnings >= amount * 4) {
            alert(`🤑 JACKPOT! You won $${winnings}! 🎉`);
          } else {
            alert(`🎉 You won $${winnings}! 🏆`);
          }
        } else {
          alert(`😅 You lost! ${winner.name} won the race. 🐎`);
        }
        
        setWeather(generateWeather());
        setIsRacing(false);
        setTimeout(() => setWinner(null), 2000);
      }, 4000);
    }
  };

  // Clean up all audio when component unmounts
  useEffect(() => {
    const currentAudios = audioFiles;
    return () => {
      currentAudios.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, [audioFiles]);

  // Update mute status for all audio files
  useEffect(() => {
    audioFiles.forEach(audio => {
      audio.muted = isMuted;
    });
  }, [isMuted, audioFiles]);

  useEffect(() => {
    document.title = "Cosmic Smasher Unstoppable Horse Race Simulator";
  }, []);

  // Add this with other state declarations at the top of the App component
  const [bribeActive, setBribeActive] = useState(false);

  return (
    <div className="App">
      <h1>Cosmic Smasher Unstoppable Horse Race Simulator</h1>
      <button 
        className="mute-button" 
        onClick={() => setIsMuted(!isMuted)}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>
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

      <HorseFacts isRacing={isRacing} />

      <BettingPanel 
        horses={horses} 
        onBet={handleBet} 
        disabled={isRacing}
        bettingHistory={bettingHistory}
        weather={weather}
      />
      <audio ref={audioRef} preload="auto">
        <source src="/sounds/first-call.mp3" type="audio/mpeg" />
        <source src="/sounds/first-call.ogg" type="audio/ogg" />
      </audio>
      {/* {showPhotoFinish && (
        <PhotoFinish 
          isVisible={showPhotoFinish} 
          winner={winner} 
          secondPlace={secondPlace}
        />
      )} */}
      <button 
        className="achievements-button"
        onClick={() => setShowAchievements(true)}
      >
        🏆 Achievements
      </button>
      
      {showAchievements && (
        <Achievements 
          achievements={achievements}
          achievementsList={achievementsList}
          onClose={() => setShowAchievements(false)}
        />
      )}

      <div className="tooltip-container">
        <button 
          className="bribe-button"
          onClick={() => handleBribe()}
          disabled={!bribeAvailable || isRacing}
        >
          {bribeAvailable ? "🤫 Bribe Jockeys ($200)" : "🕒 Bribe Unavailable"}
        </button>
        {!bribeAvailable && <span className="tooltip">Bribe not available! The jockeys are still suspicious from last time...</span>}
      </div>
    </div>
  );
}

export default App; 