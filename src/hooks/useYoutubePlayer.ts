'use client';
import React, { useImperativeHandle, useEffect, useRef } from 'react';
import useYoutubePlayer from '../hooks/useYoutubePlayer'; // Changed import syntax

interface VideoPlayerProps {
  videoId: string;
  onTimeUpdate?: (time: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnd?: () => void;
  startSeconds?: number;
  allowSeekAhead?: boolean;
  showControls?: boolean;
  showOverlays?: boolean;
}

export interface VideoPlayerHandle {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  setPlaybackRate: (rate: number) => void;
}

const VideoPlayer = React.forwardRef<VideoPlayerHandle, VideoPlayerProps>(
  (
    {
      videoId,
      onTimeUpdate,
      onPlay,
      onPause,
      onEnd,
      startSeconds = 0,
      allowSeekAhead = true,
      showControls = true,
      showOverlays = true,
    },
    ref
  ) => {
    const { player } = useYoutubePlayer({
      videoId,
      playerVars: {
        start: startSeconds,
        controls: showControls ? 1 : 0,
        modestbranding: 1,
      },
      onStateChange: (event: YT.OnStateChangeEvent) => { // Added type annotation
        switch (event.data) {
          case YT.PlayerState.PLAYING:
            onPlay?.();
            break;
          case YT.PlayerState.PAUSED:
            onPause?.();
            break;
          case YT.PlayerState.ENDED:
            onEnd?.();
            break;
        }
      },
    });

    const timeUpdateInterval = useRef<NodeJS.Timeout>();

    useImperativeHandle(ref, () => ({
      playVideo: () => player?.playVideo(),
      pauseVideo: () => player?.pauseVideo(),
      seekTo: (seconds: number, seekAhead = allowSeekAhead) => 
        player?.seekTo(seconds, seekAhead),
      getCurrentTime: () => player?.getCurrentTime() || 0,
      getDuration: () => player?.getDuration() || 0,
      setPlaybackRate: (rate: number) => player?.setPlaybackRate(rate),
    }), [player, allowSeekAhead]);

    // Handle time updates
    useEffect(() => {
      if (!player || !onTimeUpdate) return;

      timeUpdateInterval.current = setInterval(() => {
        try {
          const currentTime = player.getCurrentTime();
          onTimeUpdate(currentTime);
        } catch (error) {
          console.error('Error getting current time:', error);
        }
      }, 100);

      return () => {
        if (timeUpdateInterval.current) {
          clearInterval(timeUpdateInterval.current);
        }
      };
    }, [player, onTimeUpdate]);

    return (
      <div className="video-container">
        <div className="video-wrapper">
          <div id="yt-player" className="w-full h-full" />
          
          {showOverlays && (
            <div className="video-overlay">
              {/* Your overlay elements here */}
              <div className="metronome-overlay">
                <div className="metronome-beat">-</div>
                <span>Metronome: -- BPM</span>
              </div>
              
              <div className="cue-overlay" style={{ display: 'none' }}>
                <div className="cue-overlay-title">No active cue</div>
                <div className="cue-overlay-time">--:--</div>
              </div>
            </div>
          )}
        </div>

        {showControls && (
          <div className="video-controls">
            <button 
              className="btn-secondary" 
              onClick={() => player?.playVideo()}
            >
              ▶ Play
            </button>
            <button 
              className="btn-secondary" 
              onClick={() => player?.pauseVideo()}
            >
              ⏸ Pause
            </button>
            <button 
              className="btn-secondary" 
              onClick={() => {
                const currentTime = player?.getCurrentTime() || 0;
                player?.seekTo(Math.max(0, currentTime - 10), true);
              }}
            >
              ⏪ 10s
            </button>
            <button 
              className="btn-secondary" 
              onClick={() => {
                const currentTime = player?.getCurrentTime() || 0;
                player?.seekTo(currentTime + 10, true);
              }}
            >
              ⏩ 10s
            </button>
            <select 
              defaultValue="1"
              onChange={(e) => player?.setPlaybackRate(parseFloat(e.target.value))}
              className="playback-rate-select"
            >
              <option value="0.5">0.5x</option>
              <option value="1">1x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
            </select>
          </div>
        )}
      </div>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';
export default VideoPlayer;