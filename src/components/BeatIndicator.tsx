import { FC } from 'react';

interface BeatIndicatorProps {
  currentBeat: number;
  isRunning: boolean;
}

const BeatIndicator: FC<BeatIndicatorProps> = ({ currentBeat, isRunning }) => {
  const beats = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {beats.map(beat => (
          <div
            key={beat}
            className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold
              ${!isRunning ? 'bg-gray-200' : ''}
              ${isRunning && currentBeat === beat ? (beat === 1 || beat === 5 ? 'bg-purple-500' : 'bg-red-500') : 'bg-gray-200'}
            `}
          >
            {isRunning && currentBeat === beat ? beat : ''}
          </div>
        ))}
      </div>
      <div className="font-bold min-w-[20px] text-center">
        {isRunning ? currentBeat : '-'}
      </div>
    </div>
  );
};

export default BeatIndicator;