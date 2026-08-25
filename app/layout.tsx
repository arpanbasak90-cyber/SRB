import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'SUPER — AI Resume Evaluation',
  description: 'Pure single round-trip evaluation without tedious account creation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black min-h-screen text-foreground overflow-x-hidden p-4 md:p-8">
        
        {/* Decorative Background Elements */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
          <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] glow-sphere z-0"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] glow-sphere z-0"></div>
          <div className="absolute inset-0 bg-noise z-0"></div>
        </div>

        {/* Floating Shell Container */}
        <div className="relative z-10 max-w-[1600px] mx-auto bg-obsidian rounded-[2.5rem] ring-1 ring-white/10 shadow-2xl overflow-hidden min-h-[calc(100vh-4rem)]">
          
          {/* Navigation Header */}
          <header className="absolute top-0 left-0 right-0 z-50 px-6 py-6 flex items-center justify-between pointer-events-none">
            
            {/* Left: Logo */}
            <div className="pointer-events-auto">
              <Link href="/" className="w-12 h-12 rounded-xl bg-neon-lime text-black flex items-center justify-center font-bold text-2xl font-sans tracking-tighter">
                S
              </Link>
            </div>

            {/* Center: Navigation */}
            <nav className="pointer-events-auto hidden md:flex items-center gap-8 px-8 py-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
              <Link href="#hero" className="text-white/70 hover:text-neon-lime transition-colors text-sm font-medium">Home</Link>
              <Link href="#features" className="text-white/70 hover:text-neon-lime transition-colors text-sm font-medium">Features</Link>
              <Link href="#methodology" className="text-white/70 hover:text-neon-lime transition-colors text-sm font-medium">Methodology</Link>
            </nav>

            {/* Right: Status & Login */}
            <div className="pointer-events-auto flex items-center gap-6">
              <div className="hidden md:flex items-center gap-2 font-mono uppercase tracking-[0.2em] text-[10px] text-white/50">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-lime animate-pulse-slow"></span>
                System Operational
              </div>
              <Link href="/login" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full px-5 py-2 text-sm font-medium transition-colors">
                Login
              </Link>
            </div>
            
          </header>

          <main className="pt-32">
            {children}
          </main>
          
        </div>
      </body>
    </html>
  );
}
