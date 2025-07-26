import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const VideoPlayer = ({
  player,
  currentTime,
  cuePoints,
  overlaysVisible,
  onTimeUpdate,
  onPlay,
  onPause
}) => {
  const playerRef = useRef(null);
  const [currentCue, setCurrentCue] = useState(null);

  useEffect(() => {
    const checkActiveCue = (time) => {
      let activeCue = null;
      let minDiff = Infinity;
      
      cuePoints.forEach(cue => {
        const [minutes, seconds] = cue.time.split(':').map(Number);
        const cueTime = minutes * 60 + seconds;
        const diff = Math.abs(time - cueTime);
        
        if (diff < 0.5 && diff < minDiff) {
          activeCue = cue;
          minDiff = diff;
        }
      });
      
      setCurrentCue(activeCue);
    };

    checkActiveCue(currentTime);
  }, [currentTime, cuePoints]);

  const handlePlay = () => {
    if (player) player.playVideo();
    onPlay();
  };

  const handlePause = () => {
    if (player) player.pauseVideo();
    onPause();
  };

  const handleSkip = (seconds) => {
    if (player) {
      const newTime = player.getCurrentTime() + seconds;
      player.seekTo(newTime);
      onTimeUpdate(newTime);
    }
  };

  return (
    <div className="mb-8">
      <div className="relative pb-[56.25%] bg-gray-200 rounded-xl overflow-hidden">
        <div 
          ref={playerRef} 
          id="player" 
          className="absolute top-0 left-0 w-full h-full"
        />

        {overlaysVisible && (
          <div className="absolute inset-0 pointer-events-none z-10">
            {/* Metronome Overlay */}
            <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-3 rounded-lg flex items-center">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-2">
                <span className="text-white font-bold">-</span>
              </div>
              <span>Metronome: -- BPM</span>
            </div>

            {/* Cue Overlay */}
            {currentCue && (
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white p-3 rounded-lg max-w-xs">
                <div className="font-bold text-lg">{currentCue.title}</div>
                <div className="opacity-80 text-sm">{currentCue.time}</div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <button
          onClick={handlePlay}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          ▶ Play
        </button>
        <button
          onClick={handlePause}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          ⏸ Pause
        </button>
        <button
          onClick={() => handleSkip(-10)}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          ⏪ 10s
        </button>
        <button
          onClick={() => handleSkip(10)}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          ⏩ 10s
        </button>
        <select
          onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="1">1x</option>
          <option value="1.5">1.5x</option>
          <option value="2">2x</option>
        </select>
        <button
          onClick={() => setOverlaysVisible(!overlaysVisible)}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Toggle Overlays
        </button>
      </div>
    </div>
  );
};

VideoPlayer.propTypes = {
  player: PropTypes.object,
  currentTime: PropTypes.number.isRequired,
  cuePoints: PropTypes.array.isRequired,
  overlaysVisible: PropTypes.bool.isRequired,
  onTimeUpdate: PropTypes.func.isRequired,
  onPlay: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired
};

export default VideoPlayer;