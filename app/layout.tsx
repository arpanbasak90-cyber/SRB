import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Resume Checker & Roaster — Instant Resume Feedback',
  description: 'Paste your resume text to get an instant AI score, witty roast points, and optimized action-driven bullet rewrites.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.2),rgba(255,255,255,0))] pointer-events-none -z-10" />
        {children}
      </body>
    </html>
  );
}
