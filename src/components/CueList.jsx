import { useState } from 'react';
import PropTypes from 'prop-types';

const CueList = ({ 
  cuePoints, 
  onEdit, 
  onDelete, 
  onJump, 
  editingId,
  onSave,
  onCancel
}) => {
  const [editForm, setEditForm] = useState({
    time: '',
    title: '',
    note: '',
    beat: ''
  });

  const handleEditClick = (cue) => {
    onEdit(cue.id);
    setEditForm({
      time: cue.time,
      title: cue.title,
      note: cue.note || '',
      beat: cue.beat || ''
    });
  };

  const handleSaveClick = (id) => {
    onSave(id, editForm);
    onCancel();
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4">Cue Points</h3>
      
      {cuePoints.length === 0 ? (
        <div className="text-gray-500 italic">No cue points added yet</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-medium mb-4 text-gray-600">Timestamps</h4>
            <div className="space-y-4">
              {cuePoints.map((cue) => (
                <div key={cue.id} className="border-b border-gray-200 pb-4 last:border-0">
                  {editingId === cue.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        name="time"
                        value={editForm.time}
                        onChange={handleEditChange}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                      <input
                        type="text"
                        name="title"
                        value={editForm.title}
                        onChange={handleEditChange}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                      <input
                        type="number"
                        name="beat"
                        value={editForm.beat}
                        onChange={handleEditChange}
                        min="1"
                        max="8"
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveClick(cue.id)}
                          className="px-3 py-1 bg-green-500 text-white rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => onCancel()}
                          className="px-3 py-1 bg-gray-200 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {cue.beat && (
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-bold mr-2 
                            ${cue.beat === 1 || cue.beat === 5 ? 'bg-purple-500' : 'bg-blue-500'}`}
                          >
                            {cue.beat}
                          </span>
                        )}
                        <span>
                          <strong>{cue.time}</strong> - {cue.title}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onJump(cue.time)}
                          className="px-2 py-1 bg-gray-200 rounded text-sm"
                        >
                          Jump
                        </button>
                        <button
                          onClick={() => handleEditClick(cue)}
                          className="px-2 py-1 bg-yellow-500 text-white rounded text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(cue.id)}
                          className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4 text-gray-600">Notes</h4>
            <div className="space-y-4">
              {cuePoints.map((cue) => (
                <div key={cue.id} className="border-b border-gray-200 pb-4 last:border-0">
                  {cue.note || <span className="text-gray-400">No note</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

CueList.propTypes = {
  cuePoints: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onJump: PropTypes.func.isRequired,
  editingId: PropTypes.number,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default CueList;