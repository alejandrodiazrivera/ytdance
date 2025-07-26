'use client';

import Button from '../ui/Button';

interface VideoControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
  onToggleOverlay: () => void;
}

const VideoControls: React.FC<VideoControlsProps> = ({
  isPlaying,
  onPlay,
  onPause,
  onSkipBack,
  onSkipForward,
  onToggleOverlay,
}) => {
  return (
    <div className="flex flex-wrap gap-2 items-center mb-6">
      {isPlaying ? (
        <Button variant="secondary" onClick={onPause}>
          ⏸ Pause
        </Button>
      ) : (
        <Button variant="secondary" onClick={onPlay}>
          ▶ Play
        </Button>
      )}
      <Button variant="secondary" onClick={onSkipBack}>
        ⏪ 10s
      </Button>
      <Button variant="secondary" onClick={onSkipForward}>
        ⏩ 10s
      </Button>
      <Button variant="secondary" onClick={onToggleOverlay}>
        Toggle Overlays
      </Button>
    </div>
  );
};

export default VideoControls;