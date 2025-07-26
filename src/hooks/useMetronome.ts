import { useEffect, useRef, useState } from 'react';
import { useAudio } from './useAudio';

export const useMetronome = () => {
  const [bpm, setBpm] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const tapTimesRef = useRef<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { playClick } = useAudio();

  const tapTempo = () => {
    const now = Date.now();
    tapTimesRef.current = tapTimesRef.current.filter(time => now - time < 2000);
    tapTimesRef.current.push(now);
    
    if (tapTimesRef.current.length > 1) {
      const averageDiff = (tapTimesRef.current[tapTimesRef.current.length - 1] - tapTimesRef.current[0]) / 
                         (tapTimesRef.current.length - 1);
      setBpm(Math.round(60000 / averageDiff));
    }
  };

  const start = () => {
    if (!bpm) return;
    
    stop();
    setCurrentBeat(0);
    const interval = 60000 / bpm;
    
    // Play first beat immediately
    setCurrentBeat(prev => {
      const newBeat = (prev % 8) + 1;
      playClick(newBeat);
      return newBeat;
    });
    
    // Set interval for subsequent beats
    intervalRef.current = setInterval(() => {
      setCurrentBeat(prev => {
        const newBeat = (prev % 8) + 1;
        playClick(newBeat);
        return newBeat;
      });
    }, interval);
    
    setIsRunning(true);
  };

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    setCurrentBeat(0);
  };

  const adjustBpm = (amount: number) => {
    if (bpm) {
      const newBpm = Math.max(1, bpm + amount);
      setBpm(newBpm);
      if (isRunning) {
        start(); // Restart with new BPM
      }
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    bpm,
    currentBeat,
    isRunning,
    tapTempo,
    start,
    stop,
    adjustBpm,
    setBpm
  };
};