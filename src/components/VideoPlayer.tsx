import { FC, useState, useEffect } from 'react';
import { CuePoint } from '../types/types';

interface VideoPlayerProps {
  videoId: string | null;
  currentTime: number;
  currentBeat: number;
  currentCue: CuePoint | null;
  overlaysVisible: boolean;
  isMetronomeRunning: boolean;
}

const VideoPlayer: FC<VideoPlayerProps> = ({
  videoId,
  currentTime,
  currentBeat,
  currentCue,
  overlaysVisible,
  isMetronomeRunning
}) => {
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  useEffect(() => {
    setShowPlaceholder(!videoId);
  }, [videoId]);

  if (showPlaceholder) {
    return (
      <div className="relative pb-[56.25%] bg-gray-200 rounded-xl mb-4 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          Video will appear here
        </div>
      </div>
    );
  }

  return (
    <div className="relative pb-[56.25%] bg-gray-200 rounded-xl mb-4 overflow-hidden">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
        className="absolute inset-0 w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      
      {overlaysVisible && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {isMetronomeRunning && (
            <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white px-4 py-2 rounded-xl text-xl font-bold flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2
                ${currentBeat === 1 || currentBeat === 5 ? 'bg-purple-500' : 'bg-red-500'}`}>
                {currentBeat}
              </div>
              <span>Metronome: {currentBeat} BPM</span>
            </div>
          )}
          
          {currentCue && (
            <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white px-4 py-2 rounded-xl max-w-[300px]">
              <div className="text-lg font-bold mb-1">{currentCue.title}</div>
              <div className="text-sm opacity-80">{currentCue.time}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;