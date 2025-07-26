import { useState, useEffect } from 'react';
import VideoPlayer from './VideoPlayer';
import Metronome from './Metronome';
import AddCueForm from './AddCueForm';
import CueList from './CueList';
import useYouTubePlayer from '../hooks/useYouTubePlayer';
import useStore from '../stores/store';

const App = () => {
  const {
    cuePoints,
    addCuePoint,
    removeCuePoint,
    updateCuePoint,
    currentTime,
    setCurrentTime,
    isPlaying,
    setIsPlaying
  } = useStore();

  const {
    player,
    loadVideo,
    playVideo,
    pauseVideo,
    seekTo,
    setPlaybackRate
  } = useYouTubePlayer();

  const [videoUrl, setVideoUrl] = useState('');
  const [overlaysVisible, setOverlaysVisible] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const handleAddCue = (cue) => {
    addCuePoint({ ...cue, id: Date.now() });
  };

  const handleJumpToTimestamp = (time) => {
    const [minutes, seconds] = time.split(':').map(Number);
    const timeInSeconds = minutes * 60 + seconds;
    seekTo(timeInSeconds);
  };

  return (
    <div className="container mx-auto p-5 max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">YouTube Dance Video Analyzer</h1>
      </header>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Paste YouTube URL here..."
          className="flex-1 p-3 border border-gray-300 rounded-lg"
        />
        <button
          onClick={() => loadVideo(videoUrl)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Load Video
        </button>
      </div>

      <VideoPlayer
        player={player}
        currentTime={currentTime}
        cuePoints={cuePoints}
        overlaysVisible={overlaysVisible}
        onTimeUpdate={setCurrentTime}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <Metronome
        isPlaying={isPlaying}
        currentTime={currentTime}
        onBeatChange={(beat) => console.log('Current beat:', beat)}
      />

      <AddCueForm
        currentTime={currentTime}
        onSubmit={handleAddCue}
      />

      <CueList
        cuePoints={cuePoints}
        onEdit={setEditingId}
        onDelete={removeCuePoint}
        onJump={handleJumpToTimestamp}
        editingId={editingId}
        onSave={updateCuePoint}
        onCancel={() => setEditingId(null)}
      />
    </div>
  );
};

export default App;