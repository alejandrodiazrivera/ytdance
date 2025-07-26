import { FC } from 'react';

interface VideoControlsProps {
  onPlay: () => void;
  onPause: () => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
  onSpeedChange: (speed: number) => void;
  onAddCue: () => void;
  onToggleOverlay: () => void;
}

const VideoControls: FC<VideoControlsProps> = ({
  onPlay,
  onPause,
  onSkipBack,
  onSkipForward,
  onSpeedChange,
  onAddCue,
  onToggleOverlay
}) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <button
        onClick={onPlay}
        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg flex items-center gap-2 transition"
      >
        ▶ Play
      </button>
      <button
        onClick={onPause}
        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg flex items-center gap-2 transition"
      >
        ⏸ Pause
      </button>
      <button
        onClick={onSkipBack}
        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg flex items-center gap-2 transition"
      >
        ⏪ 10s
      </button>
      <button
        onClick={onSkipForward}
        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg flex items-center gap-2 transition"
      >
        ⏩ 10s
      </button>
      
      <select
        onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
        className="p-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
        defaultValue="1"
      >
        <option value="1">1x</option>
        <option value="1.5">1.5x</option>
        <option value="2">2x</option>
      </select>
      
      <button
        onClick={onAddCue}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
      >
        ⏺ Add Cue Point
      </button>
      
      <button
        onClick={onToggleOverlay}
        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg transition"
      >
        Toggle Overlays
      </button>
    </div>
  );
};

export default VideoControls;