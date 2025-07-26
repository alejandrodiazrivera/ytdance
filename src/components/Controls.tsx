"use client";
import React from 'react';

interface ControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onAddCue: () => void;
  onBpmChange: (bpm: number) => void;
  currentBpm?: number;
}

const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  onPlayPause,
  onAddCue,
  onBpmChange,
  currentBpm = 120
}) => {
  return (
    <div className="controls-container p-4 bg-gray-800 rounded-lg">
      <button
        onClick={onPlayPause}
        className="px-4 py-2 bg-blue-600 text-white rounded mr-4"
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      
      <button
        onClick={onAddCue}
        className="px-4 py-2 bg-green-600 text-white rounded mr-4"
      >
        Add Cue
      </button>
      
      <div className="bpm-control inline-block">
        <label className="text-white mr-2">BPM:</label>
        <input
          type="number"
          value={currentBpm}
          onChange={(e) => onBpmChange(Number(e.target.value))}
          className="w-20 px-2 py-1 rounded text-black"
          min="60"
          max="240"
        />
      </div>
    </div>
  );
};

export default Controls;