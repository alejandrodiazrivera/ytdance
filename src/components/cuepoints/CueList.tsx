'use client';

import { useState } from 'react';
import CueItem from './CueItem';
import CueForm from './CueForm';
import Button from '../ui/Button';
import { CuePoint } from '../../hooks/useCuePoints';

type Cue = {
  time: string;
  title: string;
  note?: string;
  beat?: number;
};

type CueListProps = {
  cues: CuePoint[];
  currentTime: number;
  onCuesChange: (cues: CuePoint[]) => void;
  onJumpToTime: (time: string) => void;
};

export default function CueList({
  cues,
  currentTime,
  onCuesChange,
  onJumpToTime
}: CueListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleAddCue = (newCue: Cue) => {
    onCuesChange([...cues, newCue]);
  };

  const handleUpdateCue = (id: number, updatedCue: Cue) => {
    const newCues = [...cues];
    newCues[id] = updatedCue;
    onCuesChange(newCues);
    setEditingId(null);
  };

  const handleDeleteCue = (id: number) => {
    const newCues = cues.filter((_, index) => index !== id);
    onCuesChange(newCues);
    if (editingId === id) setEditingId(null);
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Cue Points</h3>
        <Button
          variant="success"
          size="sm"
          onClick={() => {
            const minutes = Math.floor(currentTime / 60).toString().padStart(2, '0');
            const seconds = Math.floor(currentTime % 60).toString().padStart(2, '0');
            onJumpToTime(`${minutes}:${seconds}`);
          }}
        >
          ⏺ Add at Current Time
        </Button>
      </div>

      {editingId === null && (
        <CueForm
          onSubmit={handleAddCue}
          currentTime={currentTime}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-lg font-medium text-gray-600 mb-2">Timestamps</h4>
          {cues.length === 0 ? (
            <div className="text-gray-500 italic">No cue points added yet</div>
          ) : (
            <div className="space-y-2">
              {cues.map((cue, index) => (
                <CueItem
                  key={`${cue.time}-${index}`}
                  cue={cue}
                  onJump={() => onJumpToTime(cue.time)}
                  onEdit={() => setEditingId(index)}
                  onDelete={() => handleDeleteCue(index)}
                  isEditing={editingId === index}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <h4 className="text-lg font-medium text-gray-600 mb-2">Notes</h4>
          {cues.length === 0 ? (
            <div className="text-gray-500 italic">No notes available</div>
          ) : (
            <div className="space-y-2">
              {cues.map((cue, index) => (
                <div key={`note-${index}`} className="p-3 border-b">
                  {cue.note || <span className="text-gray-400">No note</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {editingId !== null && (
        <div className="mt-4">
          <CueForm
            initialTime={cues[editingId].time}
            initialTitle={cues[editingId].title}
            initialNote={cues[editingId].note || ''}
            initialBeat={cues[editingId].beat}
            onSubmit={(updatedCue) => handleUpdateCue(editingId, updatedCue)}
            onCancel={() => setEditingId(null)}
            isEditing={true}
            currentTime={currentTime}
          />
        </div>
      )}
    </div>
  );
}