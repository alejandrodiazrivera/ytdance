"use client";
import React, { useState } from 'react';

interface CueFormProps {
  onSubmit: (cue: { time: number; label: string }) => void;
  currentTime: number;
  onCancel: () => void;
}

const CueForm: React.FC<CueFormProps> = ({ onSubmit, currentTime, onCancel }) => {
  const [label, setLabel] = useState('');
  const [time, setTime] = useState(currentTime.toFixed(2));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      time: parseFloat(time),
      label
    });
    setLabel('');
  };

  return (
    <div className="cue-form p-4 bg-gray-800 rounded-lg mt-4">
      <h3 className="text-white mb-3">Add New Cue</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block text-white mb-1">Time (seconds):</label>
          <input
            type="number"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            step="0.01"
            min="0"
            className="w-full px-3 py-2 rounded text-black"
            required
          />
        </div>
        
        <div className="mb-3">
          <label className="block text-white mb-1">Label:</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full px-3 py-2 rounded text-black"
            required
          />
        </div>
        
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save Cue
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 text-white rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CueForm;