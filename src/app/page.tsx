'use client';
import { useState, useEffect, useRef } from 'react';
import { CuePoint } from '../types/types';
import { useMetronome } from '../hooks/useMetronome';
import VideoPlayer from '../components/VideoPlayer';
import VideoControls from '../components/VideoControls';
import MetronomeControls from '../components/MetronomeControls';
import CueForm from '../components/CueForm';
import CueList from '../components/CueList';

export default function Home() {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [cuePoints, setCuePoints] = useState<CuePoint[]>([]);
  const [currentCue, setCurrentCue] = useState<CuePoint | null>(null);
  const [overlaysVisible, setOverlaysVisible] = useState(true);
  const [editingCue, setEditingCue] = useState<CuePoint | null>(null);
  
  const {
    bpm,
    currentBeat,
    isRunning: isMetronomeRunning,
    tapTempo,
    start: startMetronome,
    stop: stopMetronome,
    adjustBpm
  } = useMetronome();

  const timeUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const extractVideoId = (url: string): string | null => {
    if (url.includes('youtube.com/watch?v=')) {
      return url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1].split('?')[0];
    }
    return null;
  };

  const loadVideo = () => {
    const id = extractVideoId(videoUrl);
    if (id) {
      setVideoId(id);
      startTimeTracking();
    } else {
      alert('Please enter a valid YouTube URL');
    }
  };

  const startTimeTracking = () => {
    stopTimeTracking();
    setCurrentTime(0);
    timeUpdateIntervalRef.current = setInterval(() => {
      setCurrentTime(prev => prev + 0.5);
    }, 500);
  };

  const stopTimeTracking = () => {
    if (timeUpdateIntervalRef.current) {
      clearInterval(timeUpdateIntervalRef.current);
      timeUpdateIntervalRef.current = null;
    }
  };

  const checkActiveCue = (time: number) => {
    let activeCue = null;
    let minDiff = Infinity;
    
    cuePoints.forEach(cue => {
      const [minutes, seconds] = cue.time.split(':').map(Number);
      const cueTime = minutes * 60 + seconds;
      const diff = Math.abs(time - cueTime);
      
      if (diff < 0.5 && diff < minDiff) {
        activeCue = cue;
        minDiff = diff;
      }
    });
    
    setCurrentCue(activeCue);
  };

  useEffect(() => {
    checkActiveCue(currentTime);
  }, [currentTime, cuePoints]);

  const handleAddCue = () => {
    const minutes = Math.floor(currentTime / 60).toString().padStart(2, '0');
    const seconds = Math.floor(currentTime % 60).toString().padStart(2, '0');
    const time = `${minutes}:${seconds}`;
    
    setEditingCue({
      id: Date.now().toString(),
      time,
      title: '',
      note: '',
      beat: isMetronomeRunning ? currentBeat : undefined
    });
  };

  const handleSubmitCue = (cue: Omit<CuePoint, 'id'>) => {
    if (editingCue) {
      // Update existing cue
      setCuePoints(prev => 
        prev.map(c => 
          c.id === editingCue.id ? { ...cue, id: editingCue.id } : c
        )
      );
    } else {
      // Add new cue
      setCuePoints(prev => [
        ...prev,
        { ...cue, id: Date.now().toString() }
      ]);
    }
    setEditingCue(null);
  };

  const handleEditCue = (cue: CuePoint) => {
    setEditingCue(cue);
  };

  const handleDeleteCue = (id: string) => {
    if (window.confirm('Are you sure you want to delete this cue point?')) {
      setCuePoints(prev => prev.filter(cue => cue.id !== id));
      if (editingCue?.id === id) {
        setEditingCue(null);
      }
    }
  };

  const handleJumpToTimestamp = (time: string) => {
    const [minutes, seconds] = time.split(':').map(Number);
    const newTime = minutes * 60 + seconds;
    setCurrentTime(newTime);
    alert(`Would jump to ${time} (${newTime} seconds)`);
  };

  const handlePlay = () => {
    alert('Play functionality would work with YouTube API');
    startTimeTracking();
  };

  const handlePause = () => {
    alert('Pause functionality would work with YouTube API');
    stopTimeTracking();
  };

  const handleSkipBack = () => {
    const newTime = Math.max(0, currentTime - 10);
    setCurrentTime(newTime);
    alert(`Would skip back to ${newTime} seconds`);
  };

  const handleSkipForward = () => {
    const newTime = currentTime + 10;
    setCurrentTime(newTime);
    alert(`Would skip forward to ${newTime} seconds`);
  };

  const handleSpeedChange = (speed: number) => {
    alert(`Playback speed changed to ${speed}x (would work with YouTube API)`);
  };

  const handleToggleOverlay = () => {
    setOverlaysVisible(prev => !prev);
  };

  useEffect(() => {
    return () => {
      stopTimeTracking();
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 min-h-screen max-w-4xl">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">YouTube Dance Video Analyser</h1>
      </header>

      {/* URL Input */}
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Paste YouTube URL..."
          className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-200"
        />
        <button
          onClick={loadVideo}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg"
        >
          Load Video
        </button>
      </div>

      {/* Video Player */}
      <div className="mb-4 aspect-video bg-black rounded-lg overflow-hidden">
        <VideoPlayer
          videoId={videoId}
          currentTime={currentTime}
          currentBeat={currentBeat}
          currentCue={currentCue}
          overlaysVisible={overlaysVisible}
          isMetronomeRunning={isMetronomeRunning}
        />
      </div>

      {/* Combined Controls */}
      <div className="flex flex-wrap gap-3 mb-6 p-3 bg-gray-50 rounded-lg">
        <VideoControls
          onPlay={handlePlay}
          onPause={handlePause}
          onSkipBack={handleSkipBack}
          onSkipForward={handleSkipForward}
          onSpeedChange={handleSpeedChange}
          onAddCue={handleAddCue}
          onToggleOverlay={handleToggleOverlay}
        />
        
        <MetronomeControls
          bpm={bpm}
          currentBeat={currentBeat}
          isRunning={isMetronomeRunning}
          onTapTempo={tapTempo}
          onStart={startMetronome}
          onStop={stopMetronome}
          onAdjustBpm={adjustBpm}
          className="ml-auto"
        />
      </div>

      {/* Current Cue Highlight */}
      {currentCue && (
        <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r">
          <h3 className="font-bold">Current Section:</h3>
          <p>{currentCue.title} @ {currentCue.time}</p>
          {currentCue.note && <p className="mt-2 italic">{currentCue.note}</p>}
        </div>
      )}

      {/* Floating Cue Form */}
      {editingCue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <CueForm
              currentTime={currentTime}
              currentBeat={currentBeat}
              isMetronomeRunning={isMetronomeRunning}
              onSubmit={handleSubmitCue}
              editingCue={editingCue}
              onCancel={() => setEditingCue(null)}
            />
          </div>
        </div>
      )}

      {/* Mobile Add Button */}
      <button 
        onClick={handleAddCue}
        className="md:hidden fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg z-40"
      >
        +
      </button>

      {/* Cue List */}
      <CueList
        cuePoints={cuePoints}
        currentTime={currentTime}
        onEdit={handleEditCue}
        onDelete={handleDeleteCue}
        onJump={handleJumpToTimestamp}
      />
    </div>
  )
}