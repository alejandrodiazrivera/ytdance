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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!time || !title) {
      alert('Please enter at least a time and title');
      setIsSubmitting(false);
      return;
    }
    
    try {
      await onSubmit({ time, title, note, beat });
      if (!editingCue) {
        // Reset form if it's a new cue
        setTime('');
        setTitle('');
        setNote('');
        setBeat(undefined);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          {editingCue ? '✏️ Edit Cue Point' : '➕ Add New Cue Point'}
        </h3>
        {editingCue && (
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition"
            aria-label="Close"
          >
            ✕
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="MM:SS"
                className="flex-1 p-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                required
              />
              <button
                type="button"
                onClick={handleAddCurrentTime}
                className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-3 rounded-lg transition whitespace-nowrap"
                title="Use current video time"
              >
                <span className="text-sm">⏺ Now</span>
              </button>
            </div>
          </div>
          
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (e.g., 'Spin Move')"
              className="w-full p-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
              required
            />
          </div>
        </div>

        {isMetronomeRunning && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-blue-800 mb-2">
              Metronome Beat (Current: {currentBeat})
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setBeat(num)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                    beat === num 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-blue-200 text-blue-600 hover:bg-blue-100'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add detailed notes about this cue point..."
            className="w-full p-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition min-h-[120px]"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          {editingCue && (
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-5 py-2.5 rounded-lg text-white transition flex items-center gap-2 ${
              isSubmitting 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                {editingCue ? 'Save Changes' : 'Add Cue Point'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CueForm;