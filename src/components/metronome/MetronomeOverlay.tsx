'use client';

interface MetronomeOverlayProps {
  beat: number;
  visible: boolean;
}

const MetronomeOverlay: React.FC<MetronomeOverlayProps> = ({ beat, visible }) => {
  if (!visible) return null;

  const isDownbeat = beat === 1 || beat === 5;

  return (
    <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-3 rounded-lg flex items-center gap-2 z-20">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
        isDownbeat ? 'bg-purple-500' : 'bg-red-500'
      }`}>
        {beat}
      </div>
      <span>Metronome</span>
    </div>
  );
};

export default MetronomeOverlay;