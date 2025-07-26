import { FC } from 'react';
import BeatIndicator from './BeatIndicator';

interface MetronomeControlsProps {
  bpm: number | null;
  currentBeat: number;
  isRunning: boolean;
  onTapTempo: () => void;
  onStart: () => void;
  onStop: () => void;
  onAdjustBpm: (amount: number) => void;
}

const MetronomeControls: FC<MetronomeControlsProps> = ({
  bpm,
  currentBeat,
  isRunning,
  onTapTempo,
  onStart,
  onStop,
  onAdjustBpm
}) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4">Metronome (Salsa 8-count)</h3>
      <div className="flex flex-wrap items-center gap-3 mt-4">
        <button
          onClick={onTapTempo}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg transition"
        >
          Tap Beat
        </button>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => onAdjustBpm(-1)}
            className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-full flex items-center justify-center font-bold transition"
          >
            -
          </button>
          <div className="font-bold min-w-[60px] text-center">
            {bpm ? `${bpm} BPM` : '-- BPM'}
          </div>
          <button
            onClick={() => onAdjustBpm(1)}
            className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-full flex items-center justify-center font-bold transition"
          >
            +
          </button>
        </div>
        
        <BeatIndicator currentBeat={currentBeat} isRunning={isRunning} />
        
        <button
          onClick={onStart}
          disabled={!bpm}
          className={`px-4 py-2 rounded-lg transition ${!bpm ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
        >
          Start
        </button>
        
        <button
          onClick={onStop}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          Stop
        </button>
      </div>
    </div>
  );
};

export default MetronomeControls;