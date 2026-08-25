import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col gap-32 pb-32">
      
      {/* Hero Section */}
      <section id="hero" className="px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[60vh]">
        {/* Left: Typography */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="font-mono text-neon-lime uppercase tracking-[0.2em] text-sm">AI Label // V2.0</div>
          <h1 className="text-6xl md:text-[7.5rem] leading-[0.85] font-bold tracking-tighter">
            ZERO FRICTION <br />
            <span className="italic bg-clip-text text-transparent bg-gradient-to-r from-neon-lime to-white">
              EVALUATION.
            </span>
          </h1>
          <p className="text-white/60 text-xl max-w-xl mt-6">
            Instant resume score, constructive roasts, and action-driven STAR rewrites without the tedious account creation.
          </p>
          <div className="mt-8">
            <Link href="/login" className="neon-button inline-block text-center">
              Start Demo Mode
            </Link>
          </div>
        </div>

        {/* Right: Mockup Shell */}
        <div className="lg:col-span-5 relative">
          <div className="glass-card p-6 aspect-square flex items-center justify-center relative animate-float-anim">
            <div className="absolute -top-4 -right-4 bg-neon-lime text-black font-mono text-xs px-3 py-1 rounded-full font-bold shadow-lg">
              AI Cursor
            </div>
            
            {/* Mockup Internal UI */}
            <div className="w-full h-full border border-white/5 rounded-2xl bg-black/50 p-4 flex flex-col gap-4">
              <div className="h-8 w-1/3 bg-white/10 rounded-full"></div>
              <div className="flex-1 flex gap-4">
                <div className="w-16 h-full bg-white/5 rounded-xl"></div>
                <div className="flex-1 flex flex-col gap-4">
                  <div className="h-1/2 w-full bg-white/5 rounded-xl flex items-center justify-center text-neon-lime font-bold text-4xl">
                    94
                  </div>
                  <div className="h-1/2 w-full bg-white/5 rounded-xl p-4 flex flex-col gap-2">
                    <div className="h-2 w-full bg-white/20 rounded-full"></div>
                    <div className="h-2 w-4/5 bg-white/20 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[200px]">
          
          {/* Large Card (2x2) */}
          <div className="glass-card md:col-span-2 md:row-span-2 p-8 flex flex-col justify-between group hover:border-neon-lime/40 transition-colors">
            <div>
              <h3 className="text-3xl font-bold mb-2">Instant Score & Grade</h3>
              <p className="text-white/50">Dynamic radial score gauge rating resume impact out of 100 with assigned grades.</p>
            </div>
            <div className="flex items-end gap-2 h-32 mt-8">
              {[40, 70, 50, 90, 60, 100].map((h, i) => (
                <div key={i} className="flex-1 bg-white/10 rounded-t-sm group-hover:bg-neon-lime/80 transition-colors" style={{ height: `${h}%` }}></div>
              ))}
            </div>
          </div>

          {/* Top Right Small Card */}
          <div className="glass-card md:col-span-2 p-8 group hover:border-neon-lime/40 transition-colors">
            <h3 className="text-2xl font-bold mb-2">Constructive Roast</h3>
            <p className="text-white/50">Sharp, witty bullet points calling out weak phrasing and fluff.</p>
          </div>

          {/* Accent Card */}
          <div className="md:col-span-1 rounded-[2.5rem] bg-neon-lime text-black p-8 relative overflow-hidden flex items-end">
            <div className="absolute inset-0 bg-noise"></div>
            <h3 className="text-3xl font-bold relative z-10 leading-none">STAR<br/>Rewrites</h3>
          </div>

          {/* Bottom Right Small Card */}
          <div className="glass-card md:col-span-1 p-8 group hover:border-neon-lime/40 transition-colors">
             <div className="w-12 h-12 rounded-full border-4 border-emerald-glow mb-4"></div>
             <p className="font-mono text-xs uppercase text-white/50">Secure Serverless</p>
          </div>

        </div>
      </section>

      {/* Contrast Section (Methodology) */}
      <section id="methodology" className="bg-[#e5e5e5] text-black rounded-t-[4rem] px-6 md:px-12 py-24 mx-[-1rem] md:mx-[-2rem] -mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          <div className="flex flex-col gap-12">
            <h2 className="text-5xl font-bold tracking-tight">How the AI evaluates your resume.</h2>
            
            <div className="flex flex-col gap-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full border border-black flex items-center justify-center font-mono text-lg shrink-0">01</div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Parsing & Extraction</h4>
                  <p className="text-black/70">We extract every single detail from your PDF or DOCX without losing context.</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full border border-black flex items-center justify-center font-mono text-lg shrink-0">02</div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Impact Analysis</h4>
                  <p className="text-black/70">Our models search for quantitative metrics and action verbs.</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full border border-black flex items-center justify-center font-mono text-lg shrink-0">03</div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Constructive Rewrite</h4>
                  <p className="text-black/70">We provide ready-to-use, metric-rich bullet rewrites with 1-click Copy.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative aspect-square md:aspect-auto md:h-full rounded-[2.5rem] bg-gray-300 overflow-hidden flex items-end p-8">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center grayscale mix-blend-multiply opacity-50"></div>
             
             <div className="relative z-10 glass-panel p-6 rounded-2xl w-full">
               <p className="text-white text-lg italic mb-4">"The roasting feature was brutal, but it got me the interview at Google. The STAR rewrites are incredible."</p>
               <div className="text-neon-lime font-mono text-xs uppercase tracking-widest">— Software Engineer, NYC</div>
             </div>
          </div>
          
        </div>
      </section>

      {/* Footer is handled here to sit below the contrast section */}
      <footer className="bg-black text-white px-6 md:px-12 py-24 relative overflow-hidden -mx-4 md:-mx-8 mt-16 rounded-[2.5rem]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-bold text-white/[0.03] tracking-tighter pointer-events-none select-none z-0">
          SUPER
        </div>
        
        <div className="relative z-10 flex flex-col items-center gap-16">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to upgrade your career?</h2>
            <Link href="/login" className="group relative inline-flex items-center justify-center px-12 py-6 font-bold text-black bg-neon-lime rounded-full overflow-hidden transition-transform hover:scale-105">
              <span className="absolute inset-0 w-full h-full bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></span>
              <span className="relative z-10 text-xl tracking-tight">Get Started Now</span>
            </Link>
          </div>

          <div className="w-full h-[1px] bg-white/10"></div>

          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 text-white/50 text-sm font-mono uppercase tracking-wider">
            <div>
              <p>&copy; 2026 SUPER AI INC.</p>
            </div>
            <div className="flex gap-6 justify-center">
              <Link href="#" className="hover:text-neon-lime transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-neon-lime transition-colors">Terms</Link>
            </div>
            <div className="flex gap-4 justify-end">
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:border-neon-lime hover:text-neon-lime cursor-pointer transition-colors">X</div>
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:border-neon-lime hover:text-neon-lime cursor-pointer transition-colors">IN</div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
