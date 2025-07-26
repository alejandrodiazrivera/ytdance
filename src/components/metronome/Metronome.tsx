'use client';

import { useState, useEffect, useRef } from 'react';
import BPMControls from './BPMControls';
import MetronomeOverlay from './MetronomeOverlay';
import Button from '../ui/Button';
import useMetronome from '../../hooks/useMetronome';

interface MetronomeProps {
  currentTime: number;
  onAddCue: (time: number) => void;
}

const Metronome: React.FC<MetronomeProps> = ({ currentTime, onAddCue }) => {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const tapTimes = useRef<number[]>([]);
  
  const { playClick } = useMetronome();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      const intervalMs = 60000 / bpm;
      setCurrentBeat(1);
      playClick(1);
      
      interval = setInterval(() => {
        setCurrentBeat(prev => {
          const nextBeat = prev % 8 + 1;
          playClick(nextBeat);
          return nextBeat;
        });
      }, intervalMs);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, bpm, playClick]);

  const handleTapTempo = () => {
    const now = Date.now();
    tapTimes.current = tapTimes.current.filter(time => now - time < 2000);
    tapTimes.current.push(now);
    
    if (tapTimes.current.length > 1) {
      const averageDiff = (tapTimes.current[tapTimes.current.length - 1] - 
                         tapTimes.current[0]) / 
                         (tapTimes.current.length - 1);
      setBpm(Math.round(60000 / averageDiff));
    }
  };

  const handleAddCueAtBeat = () => {
    onAddCue(currentTime);
  };

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4">Metronome (Salsa 8-count)</h3>
      
      <div className="flex flex-wrap gap-4 items-center">
        <BPMControls
          bpm={bpm}
          onIncrease={() => setBpm(b => Math.min(300, b + 1))}
          onDecrease={() => setBpm(b => Math.max(40, b - 1))}
          onTap={handleTapTempo}
        />
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
            {currentBeat}
          </div>
          <span>Beat: {currentBeat}</span>
        </div>
        
        {isPlaying ? (
          <Button variant="danger" onClick={() => setIsPlaying(false)}>
            Stop
          </Button>
        ) : (
          <Button 
            variant="primary" 
            onClick={() => setIsPlaying(true)}
            disabled={bpm <= 0}
          >
            Start
          </Button>
        )}
        
        <Button 
          variant="success" 
          onClick={handleAddCueAtBeat}
          disabled={!isPlaying}
        >
          Add Cue at Beat
        </Button>
      </div>
      
      <MetronomeOverlay beat={currentBeat} visible={isPlaying} />
    </div>
  );
};

export default Metronome;