'use client';

import { useState } from 'react';
import Button from '../ui/Button';

type CueFormProps = {
  initialTime?: string;
  initialTitle?: string;
  initialNote?: string;
  initialBeat?: number;
  onSubmit: (cue: {
    time: string;
    title: string;
    note: string;
    beat?: number;
  }) => void;
  onCancel?: () => void;
  isEditing?: boolean;
  currentTime: number;
};

export default function CueForm({
  initialTime = '',
  initialTitle = '',
  initialNote = '',
  initialBeat = undefined,
  onSubmit,
  onCancel,
  isEditing = false,
  currentTime
}: CueFormProps) {
  const [time, setTime] = useState(initialTime);
  const [title, setTitle] = useState(initialTitle);
  const [note, setNote] = useState(initialNote);
  const [beat, setBeat] = useState<number | undefined>(initialBeat);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ time, title, note, beat });
  };

  const captureCurrentTime = () => {
    const minutes = Math.floor(currentTime / 60).toString().padStart(2, '0');
    const seconds = Math.floor(currentTime % 60).toString().padStart(2, '0');
    setTime(`${minutes}:${seconds}`);
  };

  return (
    <div className="card mb-4">
      <h3 className="text-xl font-semibold mb-4">
        {isEditing ? 'Edit Cue Point' : 'Add New Cue Point'}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="Time (MM:SS)"
              className="flex-1 p-2 border rounded"
              required
              readOnly={!!initialTime}
            />
            {!initialTime && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={captureCurrentTime}
              >
                ⏺ Now
              </Button>
            )}
          </div>
          
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (e.g., 'Spin Move')"
            className="p-2 border rounded"
            required
          />
          
          <input
            type="number"
            value={beat || ''}
            onChange={(e) => setBeat(e.target.value ? parseInt(e.target.value) : undefined)}
            min="1"
            max="8"
            placeholder="Beat (1-8)"
            className="p-2 border rounded"
          />
        </div>
        
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note (e.g., 'Right foot pivot')"
          className="w-full p-2 border rounded mb-4 min-h-[100px]"
        />
        
        <div className="flex gap-2">
          <Button type="submit" variant="primary">
            {isEditing ? '💾 Save Changes' : '➕ Add Cue Point'}
          </Button>
          {isEditing && onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}