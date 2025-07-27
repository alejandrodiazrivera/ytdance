import { FC } from 'react';

interface VideoControlsProps {
  onPlay: () => void;
  onPause: () => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
  onSpeedChange: (speed: number) => void;
  onAddCue: () => void;
  onToggleOverlay: () => void;
  isPlaying: boolean;
  overlaysVisible: boolean;
}

const VideoControls: FC<VideoControlsProps> = ({
  onPlay,
  onPause,
  onSkipBack,
  onSkipForward,
  onSpeedChange,
  onAddCue,
  onToggleOverlay,
  isPlaying,
  overlaysVisible
}) => {
  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSpeedChange(parseFloat(e.target.value));
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={isPlaying ? onPause : onPlay}
        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
      >
        {isPlaying ? '⏸ Pause' : '▶ Play'}
      </button>

      <button
        onClick={onSkipBack}
        className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
      >
        ⏮ 10s
      </button>

      <button
        onClick={onSkipForward}
        className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
      >
        ⏭ 10s
      </button>

      <select
        onChange={handleSpeedChange}
        className="p-2 border border-gray-200 rounded-lg"
        defaultValue="1"
      >
        {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
          <option key={speed} value={speed}>{speed}x</option>
        ))}
      </select>

      <button
        onClick={onAddCue}
        className="p-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg"
      >
        ⏺ Add Cue
      </button>

      <button
        onClick={onToggleOverlay}
        className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg ml-auto"
      >
        {overlaysVisible ? '⚪ Overlays' : '🟢 Overlays'}
      </button>
    </div>
  );
};

export default VideoControls;