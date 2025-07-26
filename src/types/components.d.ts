declare module '../components/Controls' {
  import { FC } from 'react';
  const Controls: FC<{
    player: any;
    currentTime: number;
    cuePoints: any[];
    overlaysVisible: boolean;
    onTimeUpdate: (time: number) => void;
    onPlay: () => void;
    onPause: () => void;
  }>;
  export default Controls;
}

declare module '../components/BeatTracker' {
  import { FC } from 'react';
  const BeatTracker: FC<{
    isPlaying: boolean;
    currentTime: number;
    onBeatChange: (beat: number) => void;
  }>;
  export default BeatTracker;
}

declare module '../components/CueForm' {
  import { FC } from 'react';
  const CueForm: FC<{
    currentTime: number;
    onSubmit: (cue: any) => void;
  }>;
  export default CueForm;
}