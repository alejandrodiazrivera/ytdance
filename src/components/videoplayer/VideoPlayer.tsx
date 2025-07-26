'use client';

import { useState, useEffect } from 'react';
import VideoControls from './VideoControls';
import CueOverlay from '../cuepoints/CueOverlay';
// Add import for CuePoint type
// import type { CuePoint } from '../cuepoints/types';
// If the types file does not exist, define CuePoint type here as a temporary fix:
export type CuePoint = {
  id: string;
  time: number;
  label?: string;
};

export interface VideoPlayerProps {
  videoUrl: string;
  currentTime: number;
  currentCue: CuePoint | null;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onJumpToTime: (time: string) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  currentTime,
  currentCue,
  isPlaying,
  onPlay,
  onPause,
  onJumpToTime,
}) => {
  const [videoId, setVideoId] = useState('');
  const [showOverlays, setShowOverlays] = useState(true);

  useEffect(() => {
    if (!videoUrl) {
      setVideoId('');
      return;
    }

    let id = '';
    if (videoUrl.includes('youtube.com/watch?v=')) {
      id = videoUrl.split('v=')[1].split('&')[0];
    } else if (videoUrl.includes('youtu.be/')) {
      id = videoUrl.split('youtu.be/')[1].split('?')[0];
    }

    setVideoId(id);
  }, [videoUrl]);

  const handleSkip = (seconds: number) => {
    const newTime = Math.max(0, currentTime + seconds);
    const minutes = Math.floor(newTime / 60).toString().padStart(2, '0');
    const secondsStr = Math.floor(newTime % 60).toString().padStart(2, '0');
    onJumpToTime(`${minutes}:${secondsStr}`);
  };

  return (
    <div className="video-container">
      <div className="video-wrapper">
        {!videoId ? (
          <div className="video-placeholder">Video will appear here</div>
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
            className="absolute top-0 left-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}

        {showOverlays && (
          <div className="video-overlay absolute top-0 left-0 w-full h-full pointer-events-none z-10">
            <CueOverlay
              cue={
                currentCue
                  ? {
                      time: `${Math.floor(currentCue.time / 60)
                        .toString()
                        .padStart(2, '0')}:${Math.floor(currentCue.time % 60)
                        .toString()
                        .padStart(2, '0')}`,
                      title: currentCue.label ?? '',
                    }
                  : undefined
              }
            />
          </div>
        )}
      </div>

      <VideoControls
        isPlaying={isPlaying}
        onPlay={onPlay}
        onPause={onPause}
        onSkipBack={() => handleSkip(-10)}
        onSkipForward={() => handleSkip(10)}
        onToggleOverlay={() => setShowOverlays(!showOverlays)}
      />
    </div>
  );
  
};
export default VideoPlayer;