import { FC, useState, useEffect } from 'react';
import { CuePoint } from '../types/types';

interface CueFormProps {
  currentTime: number;
  currentBeat: number;
  isMetronomeRunning: boolean;
  onSubmit: (cue: Omit<CuePoint, 'id'>) => void;
  editingCue: CuePoint | null;
  onCancel: () => void;
}

const CueForm: FC<CueFormProps> = ({ 
  currentTime, 
  currentBeat, 
  isMetronomeRunning,
  onSubmit, 
  editingCue,
  onCancel 
}) => {
  const [time, setTime] = useState('');
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [beat, setBeat] = useState<number | undefined>();

  useEffect(() => {
    if (editingCue) {
      setTime(editingCue.time);
      setTitle(editingCue.title);
      setNote(editingCue.note);
      setBeat(editingCue.beat);
    } else {
      setTime('');
      setTitle('');
      setNote('');
      setBeat(undefined);
    }
  }, [editingCue]);

  const handleAddCurrentTime = () => {
    const minutes = Math.floor(currentTime / 60).toString().padStart(2, '0');
    const seconds = Math.floor(currentTime % 60).toString().padStart(2, '0');
    setTime(`${minutes}:${seconds}`);
    
    if (isMetronomeRunning) {
      setBeat(currentBeat);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!time || !title) {
      alert('Please enter at least a time and title');
      return;
    }
    
    onSubmit({ time, title, note, beat });
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4">
        {editingCue ? 'Edit Cue Point' : 'Add New Cue Point'}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="md:col-span-1">
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="Time (auto-captured)"
              className="w-full p-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              required
            />
          </div>
          <div className="md:col-span-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (e.g., 'Spin Move')"
              className="w-full p-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              required
            />
          </div>
          <div className="md:col-span-1">
            <button
              type="button"
              onClick={handleAddCurrentTime}
              className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg transition"
            >
              ⏺ Capture Current Time
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="cueBeat" className="block text-sm font-medium text-gray-700 mb-1">
              Beat (1-8)
            </label>
            <input
              type="number"
              id="cueBeat"
              value={beat || ''}
              onChange={(e) => setBeat(parseInt(e.target.value) || undefined)}
              min="1"
              max="8"
              placeholder="Beat number"
              className="w-full p-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            />
          </div>
        </div>
        
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note (e.g., 'Right foot pivot')"
          className="w-full p-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition min-h-[100px]"
        />
        
        <div className="flex justify-end gap-2 mt-4">
          {editingCue && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
          >
            {editingCue ? '💾 Save Changes' : '➕ Add Cue Point'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CueForm;