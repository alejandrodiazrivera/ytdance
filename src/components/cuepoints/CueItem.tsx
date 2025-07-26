'use client';

import Button from '../ui/Button';

type CueItemProps = {
  cue: {
    time: string;
    title: string;
    note?: string;
    beat?: number;
  };
  onJump: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isEditing: boolean;
};

export default function CueItem({
  cue,
  onJump,
  onEdit,
  onDelete,
  isEditing
}: CueItemProps) {
  return (
    <div className={`cue-item p-3 border-b ${isEditing ? 'bg-blue-50' : ''}`}>
      <div className={`cue-content ${isEditing ? 'hidden' : 'block'}`}>
        <div className="flex items-center">
          {cue.beat && (
            <span className={`beat-badge mr-2 ${
              cue.beat === 1 || cue.beat === 5 ? 'bg-purple-500' : 'bg-blue-500'
            }`}>
              {cue.beat}
            </span>
          )}
          <div>
            <strong>{cue.time}</strong> - {cue.title}
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 mt-2">
        <Button variant="secondary" size="sm" onClick={onJump}>
          Jump
        </Button>
        <Button variant="warning" size="sm" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="danger" size="sm" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
}