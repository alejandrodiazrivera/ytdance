import { FC } from 'react';
import { CuePoint } from '../types/types';

interface CueListProps {
  cuePoints: CuePoint[];
  currentTime: number;
  onEdit: (cue: CuePoint) => void;
  onDelete: (id: string) => void;
  onJump: (time: string) => void;
}

const CueList: FC<CueListProps> = ({ cuePoints, currentTime, onEdit, onDelete, onJump }) => {
  if (cuePoints.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Cue Points</h3>
        <div className="text-gray-500 italic">No cue points added yet</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4">Cue Points</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-medium mb-3 text-gray-600">Timestamps</h4>
          <div className="space-y-3">
            {cuePoints.map((cue) => (
              <div key={cue.id} className="border-b border-gray-200 pb-3 last:border-b-0">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    {cue.beat && (
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-bold mr-2
                        ${cue.beat === 1 || cue.beat === 5 ? 'bg-purple-500' : 'bg-blue-500'}`}>
                        {cue.beat}
                      </span>
                    )}
                    <div>
                      <strong>{cue.time}</strong> - {cue.title}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onJump(cue.time)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-1 rounded text-sm transition"
                    >
                      Jump
                    </button>
                    <button
                      onClick={() => onEdit(cue)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-sm transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(cue.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-lg font-medium mb-3 text-gray-600">Notes</h4>
          <div className="space-y-3">
            {cuePoints.map((cue) => (
              <div key={cue.id} className="border-b border-gray-200 pb-3 last:border-b-0">
                {cue.note || <span className="text-gray-500 italic">No note</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CueList;