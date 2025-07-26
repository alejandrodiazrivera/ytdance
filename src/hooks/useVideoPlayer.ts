import { useState, useRef, useEffect } from "react";

export const useVideoPlayer = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [videoId, setVideoId] = useState("");
  const [playerState, setPlayerState] = useState({
    isPlaying: false,
    currentTime: 0,
    playbackRate: 1,
  });
  const playStartRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);

  // Extract YouTube ID from URL
  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Load video by URL
  const loadVideo = (url: string) => {
    const id = extractVideoId(url);
    if (id) setVideoId(id);
    else alert("Invalid YouTube URL");
  };

  // Play/pause using postMessage
  const playVideo = () => {
    iframeRef.current?.contentWindow?.postMessage(
      '{"event":"command","func":"playVideo","args":""}',
      "*"
    );
    playStartRef.current = Date.now();
    setPlayerState((prev) => ({ ...prev, isPlaying: true }));
  };

  const pauseVideo = () => {
    iframeRef.current?.contentWindow?.postMessage(
      '{"event":"command","func":"pauseVideo","args":""}',
      "*"
    );
    if (playStartRef.current) {
      lastTimeRef.current += (Date.now() - playStartRef.current) / 1000;
    }
    setPlayerState((prev) => ({ ...prev, isPlaying: false }));
  };

  // Seek to time
  const seekTo = (seconds: number) => {
    iframeRef.current?.contentWindow?.postMessage(
      `{"event":"command","func":"seekTo","args":[${seconds},true]}`,
      "*"
    );
    lastTimeRef.current = seconds;
    setPlayerState((prev) => ({ ...prev, currentTime: seconds }));
  };

  // Simulate time tracking
  useEffect(() => {
    const timer = setInterval(() => {
      if (playerState.isPlaying && playStartRef.current) {
        const elapsed = (Date.now() - playStartRef.current) / 1000;
        setPlayerState((prev) => ({
          ...prev,
          currentTime: lastTimeRef.current + elapsed,
        }));
      }
    }, 100);
    return () => clearInterval(timer);
  }, [playerState.isPlaying]);

  return {
    iframeRef,
    videoId,
    playerState,
    loadVideo,
    playVideo,
    pauseVideo,
    seekTo,
  };
};