import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

export const useMetronome = (
  bpm: number,
  isActive: boolean,
  onBeat: (beat: number) => void
) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const beatRef = useRef(0);

  useEffect(() => {
    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
      gainNodeRef.current = audioContextRef.current.createGain();
      
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.value = 0.5;
        gainNodeRef.current.connect(audioContextRef.current.destination);
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close();
      }
    };
  }, []);

  const playBeat = (beat: number) => {
    if (!audioContextRef.current || !gainNodeRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = beat % 4 === 0 ? 800 : 400;
    oscillator.connect(gainNodeRef.current);
    oscillator.start();
    oscillator.stop(audioContextRef.current.currentTime + 0.05);
  };

  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const interval = (60 / bpm) * 1000;
    let lastTime = performance.now();

    const scheduleBeat = (time: number) => {
      const drift = time - lastTime;
      const nextInterval = interval - drift;

      beatRef.current = (beatRef.current + 1) % 4;
      onBeat(beatRef.current);
      playBeat(beatRef.current);

      lastTime = time + nextInterval;
      timerRef.current = setTimeout(() => scheduleBeat(lastTime), nextInterval);
    };

    lastTime = performance.now();
    timerRef.current = setTimeout(() => scheduleBeat(lastTime), interval);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [bpm, isActive, onBeat]);

  return { beat: beatRef.current };
};