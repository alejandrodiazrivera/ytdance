import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AddCueForm = ({ currentTime, onSubmit }) => {
  const [cue, setCue] = useState({
    time: '',
    title: '',
    note: '',
    beat: ''
  });

  // Auto-capture current time when currentTime changes
  useEffect(() => {
    const minutes = Math.floor(currentTime / 60).toString().padStart(2, '0');
    const seconds = Math.floor(currentTime % 60).toString().padStart(2, '0');
    setCue(prev => ({ ...prev, time: `${minutes}:${seconds}` }));
  }, [currentTime]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCue(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cue.time || !cue.title) {
      alert('Please enter at least a time and title');
      return;
    }
    onSubmit(cue);
    setCue({ time: '', title: '', note: '', beat: '' });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4">Add New Cue Point</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="time"
            value={cue.time}
            onChange={handleChange}
            placeholder="Time"
            className="p-3 border border-gray-300 rounded-lg"
            readOnly
          />
          <input
            type="text"
            name="title"
            value={cue.title}
            onChange={handleChange}
            placeholder="Title (e.g., 'Spin Move')"
            className="p-3 border border-gray-300 rounded-lg"
            required
          />
          <button
            type="submit"
            className="px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg"
          >
            Add Cue Point
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="cueBeat" className="block mb-2 text-sm font-medium text-gray-700">
              Beat (1-8)
            </label>
            <input
              type="number"
              id="cueBeat"
              name="beat"
              value={cue.beat}
              onChange={handleChange}
              min="1"
              max="8"
              placeholder="Beat number"
              className="p-3 border border-gray-300 rounded-lg w-full"
            />
          </div>
        </div>
        
        <textarea
          name="note"
          value={cue.note}
          onChange={handleChange}
          placeholder="Note (e.g., 'Right foot pivot')"
          className="p-3 border border-gray-300 rounded-lg w-full min-h-[100px]"
        />
      </form>
    </div>
  );
};

AddCueForm.propTypes = {
  currentTime: PropTypes.number.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default AddCueForm;