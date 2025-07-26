'use client';
import React, { useState, useRef, useCallback } from 'react';
import VideoPlayer, { type VideoPlayerHandle } from '../components/VideoPlayer';
import Controls from '../components/Controls';
import BeatTracker from '../components/BeatTracker';
import CueForm from '../components/CueForm';
import CueList from '../components/CueList';

interface CuePoint {
  id: string;
  time: number;
  label: string;
  description: string;
}

export default function Home() {
  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [bpm, setBpm] = useState(120);
  const [showCueForm, setShowCueForm] = useState(false);
  const playerRef = useRef<VideoPlayerHandle>(null);

  // Cue management
  const [cuePoints, setCuePoints] = useState<CuePoint[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Calculate current beat from time and BPM
  const currentBeat = Math.floor(currentTime * (bpm / 60));

  // Player control handlers
  const handlePlay = useCallback(() => setIsPlaying(true), []);
  const handlePause = useCallback(() => setIsPlaying(false), []);
  const handleTimeUpdate = useCallback((time: number) => setCurrentTime(time), []);

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      playerRef.current?.pauseVideo();
    } else {
      playerRef.current?.playVideo();
    }
  }, [isPlaying]);

  // Cue point handlers
  const handleAddCue = useCallback((cue: { time: number; label: string }) => {
    setCuePoints(prev => [
      ...prev,
      {
        ...cue,
        id: Date.now().toString(),
        description: ''
      }
    ]);
    setShowCueForm(false);
  }, []);

  const handleEditCue = useCallback((id: string) => setEditingId(id), []);
  const handleDeleteCue = useCallback((id: string) => {
    setCuePoints(prev => prev.filter(cue => cue.id !== id));
  }, []);

  const handleJumpToCue = useCallback((time: number) => {
    playerRef.current?.seekTo(time);
    playerRef.current?.playVideo();
  }, []);

  const handleSaveCue = useCallback((updatedCue: CuePoint) => {
    setCuePoints(prev => prev.map(cue => 
      cue.id === updatedCue.id ? updatedCue : cue
    ));
    setEditingId(null);
  }, []);

  const handleCancelEdit = useCallback(() => setEditingId(null), []);

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video Player Section */}
        <section className="lg:col-span-2">
          <VideoPlayer
            ref={playerRef}
            videoId="LLTLnK69Iig"
            startSeconds={9} // Rick Astley starting at 9 seconds
            onTimeUpdate={handleTimeUpdate}
            onPlay={handlePlay}
            onPause={handlePause}
          />
        </section>

        {/* Control Panel Section */}
        <section className="space-y-6">
          <Controls
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onAddCue={() => setShowCueForm(true)}
            onBpmChange={setBpm}
            currentBpm={bpm}
          />

          <BeatTracker
            bpm={bpm}
            isPlaying={isPlaying}
            currentBeat={currentBeat}
          />

          {showCueForm && (
            <CueForm
              currentTime={currentTime}
              onSubmit={handleAddCue}
              onCancel={() => setShowCueForm(false)}
            />
          )}

          <CueList
            cuePoints={cuePoints}
            onEdit={handleEditCue}
            onDelete={handleDeleteCue}
            onJump={handleJumpToCue}
            editingId={editingId}
            onSave={handleSaveCue}
            onCancel={handleCancelEdit}
          />
        </section>
      </div>
    </main>
  );
}