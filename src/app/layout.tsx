// app/layout.tsx
import './globals.css';

export const metadata = {
  title: 'YouTube Dance Video Analyzer',
  description: 'Analyze dance videos with metronome and cue points',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}