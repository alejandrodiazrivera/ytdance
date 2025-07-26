'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { VideoPlayer } from '../components/videoplayer/VideoPlayer';
import Metronome from '../components/metronome/Metronome';
import CueList from '../components/cuepoints/CueList';
import useCuePoints from '../hooks/useCuePoints';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import VideoPlayer from '@/components/videoplayer/VideoPlayer'; 

export default function HomePage() {
  const [videoUrl, setVideoUrl] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoId, setVideoId] = useState('');
  const timeUpdateInterval = useRef<NodeJS.Timeout | null>(null);
  
  const {
    cues,
    currentCue,
    setCues,
    checkActiveCue,
    timeToSeconds
  } = useCuePoints();

  const handleLoadVideo = useCallback((url: string) => {
    let id = '';
    if (url.includes('youtube.com/watch?v=')) {
      id = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      id = url.split('youtu.be/')[1].split('?')[0];
    }

    if (id) {
      setVideoId(id);
      startTimeTracking();
    } else {
      alert('Please enter a valid YouTube URL');
    }
  }, []);

  const startTimeTracking = useCallback(() => {
    stopTimeTracking();
    setCurrentTime(0);
    timeUpdateInterval.current = setInterval(() => {
      setCurrentTime(prev => {
        const newTime = prev + 0.5;
        checkActiveCue(newTime);
        return newTime;
      });
    }, 500);
  }, [checkActiveCue]);

  const stopTimeTracking = useCallback(() => {
    if (timeUpdateInterval.current) {
      clearInterval(timeUpdateInterval.current);
      timeUpdateInterval.current = null;
    }
  }, []);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    startTimeTracking();
  }, [startTimeTracking]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    stopTimeTracking();
  }, [stopTimeTracking]);

  const handleJumpToTime = useCallback((time: string) => {
    const seconds = timeToSeconds(time);
    setCurrentTime(seconds);
    // In a real app: player.seekTo(seconds);
  }, [timeToSeconds]);

  const handleSkip = useCallback((seconds: number) => {
    const newTime = Math.max(0, currentTime + seconds);
    const minutes = Math.floor(newTime / 60).toString().padStart(2, '0');
    const secondsStr = Math.floor(newTime % 60).toString().padStart(2, '0');
    handleJumpToTime(`${minutes}:${secondsStr}`);
  }, [currentTime, handleJumpToTime]);

  useEffect(() => {
    return () => stopTimeTracking();
  }, [stopTimeTracking]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">YouTube Dancevideo Analyzer</h1>
      </header>

      <div className="flex gap-4 mb-6">
        <Input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Paste YouTube URL here..."
          className="flex-1"
        />
        <Button
          onClick={() => handleLoadVideo(videoUrl)}
          variant="primary"
        >
          Load Video
        </Button>
      </div>

      <VideoPlayer
        videoId={videoId}
        currentTime={currentTime}
        currentCue={
          currentCue
            ? {
                ...currentCue,
                time: typeof currentCue.time === 'string'
                  ? timeToSeconds(currentCue.time)
                  : currentCue.time
              }
            : null
        }
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onSkipBack={() => handleSkip(-10)}
        onSkipForward={() => handleSkip(10)}
      />

      <Metronome
        currentTime={currentTime}
        onAddCue={(time) => {
          const minutes = Math.floor(time / 60).toString().padStart(2, '0');
          const seconds = Math.floor(time % 60).toString().padStart(2, '0');
          handleJumpToTime(`${minutes}:${seconds}`);
        }}
      />

      <CueList
        cues={cues}
        currentTime={currentTime}
        onCuesChange={setCues}
        onJumpToTime={handleJumpToTime}
      />
    </div>
  );}