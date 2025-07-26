import { useState, useCallback } from 'react';

export interface CuePoint {
  id: string; // Unique identifier for the cue point
  time: string;
  title: string;
  note?: string;
  beat?: number;
}

const useCuePoints = (initialCues: CuePoint[] = []) => {
  const [cues, setCues] = useState<CuePoint[]>(initialCues);
  const [currentCue, setCurrentCue] = useState<CuePoint | null>(null);

  const checkActiveCue = useCallback((currentTime: number) => {
    let activeCue = null;
    let minDiff = Infinity;

    cues.forEach(cue => {
      const [minutes, seconds] = cue.time.split(':').map(Number);
      const cueTime = minutes * 60 + seconds;
      const diff = Math.abs(currentTime - cueTime);
      
      if (diff < 0.5 && diff < minDiff) {
        activeCue = cue;
        minDiff = diff;
      }
    });

    setCurrentCue(activeCue);
  }, [cues]);

  const timeToSeconds = useCallback((time: string) => {
    const [minutes, seconds] = time.split(':').map(Number);
    return minutes * 60 + seconds;
  }, []);

  const sortedCues = [...cues].sort((a, b) => 
    timeToSeconds(a.time) - timeToSeconds(b.time)
  );

  return {
    cues: sortedCues,
    currentCue,
    setCues,
    checkActiveCue,
    timeToSeconds
  };
};

export default useCuePoints;