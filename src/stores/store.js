import { create } from 'zustand';

const useStore = create((set) => ({
  cuePoints: [],
  currentTime: 0,
  isPlaying: false,
  
  // Actions
  addCuePoint: (cue) => set((state) => ({ 
    cuePoints: [...state.cuePoints, { ...cue, id: Date.now() }]
  })),
  
  removeCuePoint: (id) => set((state) => ({ 
    cuePoints: state.cuePoints.filter(c => c.id !== id) 
  })),
  
  updateCuePoint: (id, updatedCue) => set((state) => ({
    cuePoints: state.cuePoints.map(c => 
      c.id === id ? { ...c, ...updatedCue } : c
    )
  })),
  
  setCurrentTime: (time) => set({ currentTime: time }),
  setIsPlaying: (playing) => set({ isPlaying: playing })
}));

export default useStore;