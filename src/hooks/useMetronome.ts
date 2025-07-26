import { useCallback, useEffect, useRef } from 'react';

const useMetronome = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 800;
    gainNode.gain.value = 0;
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    oscillator.start();
    
    gainNodeRef.current = gainNode;
    oscillatorRef.current = oscillator;

    return () => {
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close();
      }
    };
  }, []);

  const playClick = useCallback((beat: number) => {
    if (!gainNodeRef.current || !audioContextRef.current) return;

    const isDownbeat = beat === 1 || beat === 5;
    const now = audioContextRef.current.currentTime;
    
    gainNodeRef.current.gain.cancelScheduledValues(now);
    
    if (isDownbeat) {
      gainNodeRef.current.gain.setValueAtTime(0.7, now);
      gainNodeRef.current.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    } else {
      gainNodeRef.current.gain.setValueAtTime(0.5, now);
      gainNodeRef.current.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    }
  }, []);

  return { playClick };
};

export default useMetronome;