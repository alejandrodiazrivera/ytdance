'use client';
import React, { useImperativeHandle, useEffect } from 'react';
import { useYoutubePlayer } from '../hooks/useYoutubePlayer';

interface VideoPlayerProps {
  videoId: string;
  onTimeUpdate?: (time: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnd?: () => void;
  startSeconds?: number;
  allowSeekAhead?: boolean;
}

export interface VideoPlayerHandle {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  getCurrentTime: () => number;
}

const VideoPlayer = React.forwardRef<VideoPlayerHandle, VideoPlayerProps>(
  (
    { videoId, onTimeUpdate, onPlay, onPause, onEnd, startSeconds = 0, allowSeekAhead = true },
    ref
  ) => {
    const { player } = useYoutubePlayer({
      videoId,
      playerVars: {
        start: startSeconds,
        controls: 1,
        modestbranding: 1,
      },
      onStateChange: (event) => {
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

    useImperativeHandle(ref, () => ({
      playVideo: () => {
        if (!player) {
          console.warn('Player not ready');
          return;
        }
        player.playVideo();
      },
      pauseVideo: () => {
        if (!player) {
          console.warn('Player not ready');
          return;
        }
        player.pauseVideo();
      },
      seekTo: (seconds: number, seekAhead = allowSeekAhead) => {
        if (!player) {
          console.warn('Player not ready');
          return;
        }
        player.seekTo(seconds, seekAhead);
      },
      getCurrentTime: () => {
        if (!player) {
          console.warn('Player not ready');
          return 0;
        }
        return player.getCurrentTime();
      },
    }), [player, allowSeekAhead]);

    // Handle time updates
    useEffect(() => {
      if (!player || !onTimeUpdate) return;

      const interval = setInterval(() => {
        try {
          const currentTime = player.getCurrentTime();
          onTimeUpdate(currentTime);
        } catch (error) {
          console.error('Error getting current time:', error);
        }
      }, 100);

      return () => clearInterval(interval);
    }, [player, onTimeUpdate]);

    return (
      <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
        <div id="yt-player" className="w-full h-full" />
      </div>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';
export default VideoPlayer;