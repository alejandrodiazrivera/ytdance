import { useEffect, useRef } from 'react';

const useMetronome = (bpm, isActive, onBeat) => {
  const audioContextRef = useRef(null);
  const gainNodeRef = useRef(null);
  const intervalRef = useRef(null);
  const beatCountRef = useRef(0);

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
    
    onBeat(beat);
  };

  // Start/stop metronome
  useEffect(() => {
    if (isActive && bpm > 0) {
      const interval = 60000 / bpm;
      
      // Play first beat immediately
      beatCountRef.current = (beatCountRef.current % 8) + 1;
      playClick(beatCountRef.current);
      
      // Set interval for subsequent beats
      intervalRef.current = setInterval(() => {
        beatCountRef.current = (beatCountRef.current % 8) + 1;
        playClick(beatCountRef.current);
      }, interval);
      
      return () => clearInterval(intervalRef.current);
    } else {
      clearInterval(intervalRef.current);
    }
  }, [isActive, bpm]);

  return {
    currentBeat: beatCountRef.current
  };
};

export default useMetronome;