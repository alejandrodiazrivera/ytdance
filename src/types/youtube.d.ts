// src/types/youtube.d.ts
declare namespace YT {
  interface PlayerOptions {
    videoId: string;
    playerVars?: {
      autoplay?: 0 | 1;
      start?: number;
      controls?: 0 | 1;
      modestbranding?: 0 | 1;
    };
    events?: {
      onReady?: (event: { target: Player }) => void;
      onStateChange?: (event: { data: number }) => void;
    };
  }

  class Player {
    constructor(id: string, options: PlayerOptions);
    playVideo(): void;
    pauseVideo(): void;
    seekTo(seconds: number, allowSeekAhead: boolean): void;
    getCurrentTime(): number;
    getDuration(): number;
    setPlaybackRate(rate: number): void;
    destroy(): void;
  }

  const PlayerState: {
    UNSTARTED: -1;
    ENDED: 0;
    PLAYING: 1;
    PAUSED: 2;
    BUFFERING: 3;
    CUED: 5;
  };
}

declare interface Window {
  YT: typeof YT;
  onYouTubeIframeAPIReady?: () => void;
}