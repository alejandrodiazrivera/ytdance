'use client';

import Button from '../ui/Button';

interface BPMControlsProps {
  bpm: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onTap: () => void;
}

const BPMControls: React.FC<BPMControlsProps> = ({
  bpm,
  onIncrease,
  onDecrease,
  onTap,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Button variant="secondary" onClick={onTap}>
        Tap Beat
      </Button>
      
      <div className="flex items-center gap-1">
        <Button 
          variant="secondary" 
          onClick={onDecrease}
          className="w-8 h-8 rounded-full p-0 flex items-center justify-center"
        >
          -
        </Button>
        
        <div className="w-16 text-center font-bold">
          {bpm} BPM
        </div>
        
        <Button 
          variant="secondary" 
          onClick={onIncrease}
          className="w-8 h-8 rounded-full p-0 flex items-center justify-center"
        >
          +
        </Button>
      </div>
    </div>
  );
};

export default BPMControls;