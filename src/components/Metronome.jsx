import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const Metronome = ({ isPlaying, currentTime, onBeatChange }) => {
  const [bpm, setBpm] = useState(120);
  const [isActive, setIsActive] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [tapTimes, setTapTimes] = useState([]);
  const audioContextRef = useRef(null);
  const gainNodeRef = useRef(null);
  const intervalRef = useRef(null);

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContextRef.current.createOscillator();
    gainNodeRef.current = audioContextRef.current.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 800;
    gainNodeRef.current.gain.value = 0;
    
    oscillator.connect(gainNodeRef.current);
    gainNodeRef.current.connect(audioContextRef.current.destination);
    oscillator.start();
    
    return () => {
      oscillator.stop();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Play metronome click
  const playClick = (beat) => {
    if (!gainNodeRef.current) return;
    
    if (beat === 1 || beat === 5) {
      // Downbeat
      gainNodeRef.current.gain.cancelScheduledValues(audioContextRef.current.currentTime);
      gainNodeRef.current.gain.setValueAtTime(0.7, audioContextRef.current.currentTime);
      gainNodeRef.current.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.2);
    } else {
      // Regular beat
      gainNodeRef.current.gain.cancelScheduledValues(audioContextRef.current.currentTime);
      gainNodeRef.current.gain.setValueAtTime(0.5, audioContextRef.current.currentTime);
      gainNodeRef.current.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.1);
    }
    
    onBeatChange(beat);
  };

  // Start/stop metronome
  useEffect(() => {
    if (isActive) {
      const interval = 60000 / bpm;
      
      // Play first beat immediately
      setCurrentBeat(prev => {
        const nextBeat = (prev % 8) + 1;
        playClick(nextBeat);
        return nextBeat;
      });
      
      // Set interval for subsequent beats
      intervalRef.current = setInterval(() => {
        setCurrentBeat(prev => {
          const nextBeat = (prev % 8) + 1;
          playClick(nextBeat);
          return nextBeat;
        });
      }, interval);
      
      return () => clearInterval(intervalRef.current);
    } else {
      clearInterval(intervalRef.current);
    }
  }, [isActive, bpm]);

  // Tap tempo functionality
  const handleTapTempo = () => {
    const now = Date.now();
    const newTapTimes = [...tapTimes, now].filter(time => now - time < 2000);
    setTapTimes(newTapTimes);
    
    if (newTapTimes.length > 1) {
      const averageDiff = (newTapTimes[newTapTimes.length - 1] - newTapTimes[0]) / (newTapTimes.length - 1);
      setBpm(Math.round(60000 / averageDiff));
    }
  };

  // Adjust BPM
  const adjustBpm = (amount) => {
    setBpm(prev => Math.max(1, prev + amount));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4">Metronome (Salsa 8-count)</h3>
      
      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={handleTapTempo}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Tap Beat
        </button>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => adjustBpm(-1)}
            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
          >
            -
          </button>
          <div className="font-bold min-w-[60px] text-center">
            {bpm} BPM
          </div>
          <button
            onClick={() => adjustBpm(1)}
            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
          >
            +
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center 
            ${currentBeat === 1 || currentBeat === 5 ? 'bg-purple-500' : 
              isActive ? 'bg-red-500' : 'bg-gray-300'}`}
          >
            {isActive ? currentBeat : '-'}
          </div>
        </div>
        
        <button
          onClick={() => setIsActive(true)}
          disabled={isActive}
          className={`px-4 py-2 rounded-lg ${isActive ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
        >
          Start
        </button>
        
        <button
          onClick={() => setIsActive(false)}
          disabled={!isActive}
          className={`px-4 py-2 rounded-lg ${!isActive ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'} text-white`}
        >
          Stop
        </button>
      </div>
    </div>
  );
};

Metronome.propTypes = {
  isPlaying: PropTypes.bool.isRequired,
  currentTime: PropTypes.number.isRequired,
  onBeatChange: PropTypes.func.isRequired
};

export default Metronome;