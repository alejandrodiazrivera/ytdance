// app/page.tsx
'use client';

import dynamic from 'next/dynamic';

// Client-side only components
const VideoPlayer = dynamic(() => import('@/components/VideoPlayer'), { ssr: false });
const Metronome = dynamic(() => import('@/components/Metronome'), { ssr: false });
const CueList = dynamic(() => import('@/components/CueList'), { ssr: false });
const AddCueForm = dynamic(() => import('@/components/AddCueForm'), { ssr: false });

export default function Home() {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">YouTube Dance Video Analyzer</h1>
      </header>

      <div className="space-y-8">
        <VideoPlayer />
        <Metronome />
        <AddCueForm />
        <CueList />
      </div>
    </>
  );
}