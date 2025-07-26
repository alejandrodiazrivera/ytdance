'use client';

type CueOverlayProps = {
  cue?: {
    time: string;
    title: string;
  };
  visible?: boolean;
};

export default function CueOverlay({ cue, visible = true }: CueOverlayProps) {
  if (!cue || !visible) return null;

  return (
    <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white p-3 rounded-lg max-w-xs">
      <div className="font-bold text-lg">{cue.title}</div>
      <div className="text-sm opacity-80">{cue.time}</div>
    </div>
  );
}