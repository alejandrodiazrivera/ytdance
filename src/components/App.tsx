import { useState } from "react";
import VideoPlayer from "./videoplayer/VideoPlayer";
import { VideoControls } from "./videoplayer/VideoControls";
import { useVideoPlayer } from "../hooks/useVideoPlayer";
import { Metronome } from "./metronome/Metronome";
import CueForm from "./cuepoints/CueForm";
import { CueList } from "./cuepoints/CueList";
import { CuePoint } from "../types/types";


export default function App() {
  const { playerState, onPlay, onPause, onSeek } = useVideoPlayer();
  const [cuePoints, setCuePoints] = useState<CuePoint[]>([]);
  const [editingCue, setEditingCue] = useState<CuePoint | null>(null);

  const handleCueSubmit = (cue: { time: string; title: string; note: string; beat?: number }) => {
    const newCue: CuePoint = {
      id: editingCue ? editingCue.id : Math.random().toString(36).substr(2, 9),
      time: Number(cue.time),
      title: cue.title,
      note: cue.note,
      beat: cue.beat,
    };
    if (editingCue) {
      setCuePoints(cuePoints.map((c) => (c.id === newCue.id ? newCue : c)));
    } else {
      setCuePoints([...cuePoints, newCue]);
    }
    setEditingCue(null);
  };

  return (
    <div className="app">
      <VideoPlayer
        videoUrl={playerState.videoUrl}
        currentTime={playerState.currentTime}
        isPlaying={playerState.isPlaying}
        onPlay={onPlay}
        onPause={onPause}
        onSeek={onSeek}
      />
      <VideoControls />
      <Metronome />
      <CueForm
        onSubmit={handleCueSubmit}
        editingCue={editingCue}
        onCancel={() => setEditingCue(null)}
        currentTime={playerState.currentTime}
      />
      <CueList
        cues={cuePoints}
        onEdit={setEditingCue}
        onDelete={(id: CuePoint["id"]) => setCuePoints(cuePoints.filter((c) => c.id !== id))}
      />
    </div>
  );
}