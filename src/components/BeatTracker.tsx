"use client";
import React, { useEffect, useRef } from 'react';

interface BeatTrackerProps {
  bpm: number;
  isPlaying: boolean;
  currentBeat: number;  // Changed from implementation to type declaration
  beatsPerMeasure?: number;
}

const BeatTracker: React.FC<BeatTrackerProps> = ({
  bpm,
  isPlaying,
  currentBeat,
  beatsPerMeasure = 4
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw beats
    const radius = 10;
    const padding = 20;
    const availableWidth = canvas.width - padding * 2;
    const beatSpacing = availableWidth / beatsPerMeasure;

    for (let i = 0; i < beatsPerMeasure; i++) {
      const x = padding + i * beatSpacing;
      const y = canvas.height / 2;
      
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = i === currentBeat % beatsPerMeasure && isPlaying 
        ? '#ff5722' 
        : '#555';
      ctx.fill();
    }
  }, [currentBeat, isPlaying, beatsPerMeasure]);

  return (
    <div className="beat-tracker my-4">
      <h3 className="text-white mb-2">Beat Tracker: {bpm} BPM</h3>
      <canvas 
        ref={canvasRef} 
        width={300} 
        height={50}
        className="bg-gray-700 rounded"
      />
    </div>
  );
};

export default BeatTracker;