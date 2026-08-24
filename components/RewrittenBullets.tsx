'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Copy, Check, ArrowRight, Lightbulb } from 'lucide-react';

interface BulletItem {
  original: string;
  improved: string;
  reason: string;
}

interface RewrittenBulletsProps {
  bullets: BulletItem[];
}

export const RewrittenBullets: React.FC<RewrittenBulletsProps> = ({ bullets }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card rounded-2xl p-6 border-indigo-500/20"
    >
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Action-Driven Bullet Rewrites</h3>
            <p className="text-xs text-slate-400">High-impact STAR format bullet points ready to copy</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {bullets.map((bullet, index) => (
          <div
            key={index}
            className="group rounded-xl border border-slate-800 bg-slate-900/80 hover:border-indigo-500/30 transition-all p-5 space-y-4"
          >
            {/* Original Weak Bullet */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400/90 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                Original Weak Version
              </span>
              <p className="text-slate-400 text-sm italic line-through decoration-rose-500/40 pl-3 border-l-2 border-slate-800">
                "{bullet.original}"
              </p>
            </div>

            {/* Improved High-Impact Bullet */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  Improved AI Rewrite
                </span>

                <button
                  onClick={() => handleCopy(bullet.improved, index)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 transition-all font-medium active:scale-95"
                  title="Copy improved bullet to clipboard"
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Bullet</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-white font-medium text-sm leading-relaxed flex items-start justify-between gap-3">
                <span>{bullet.improved}</span>
              </div>
            </div>

            {/* Rationale explanation */}
            <div className="flex items-start gap-2 text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span><strong className="text-slate-300">Why this is better:</strong> {bullet.reason}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
