export interface CuePoint {
  id: string;
  time: number;
  title: string;
  note?: string;
  beat?: number;
  label?: string;
}

export interface MetronomeState {
  bpm: number;
  isPlaying: boolean;
  currentBeat: number;
}

export interface VideoPlayerState {
  isPlaying: boolean;
  currentTime: number;
  showOverlays: boolean;
}