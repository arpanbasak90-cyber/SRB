'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Flame, CheckCircle2 } from 'lucide-react';

interface RoastListProps {
  roasts: string[];
  strengths: string[];
}

export const RoastList: React.FC<RoastListProps> = ({ roasts, strengths }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Roast Points Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass-card rounded-2xl p-6 border-rose-500/20 bg-rose-950/10"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">The Roast & Critiques</h3>
            <p className="text-xs text-slate-400">Sharp weaknesses holding your resume back</p>
          </div>
        </div>

        <ul className="space-y-3">
          {roasts.map((roast, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-rose-500/10 text-slate-300 text-sm leading-relaxed"
            >
              <span className="text-rose-400 shrink-0 mt-0.5 font-bold text-xs">#{index + 1}</span>
              <span>{roast}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Strengths & Highlights Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-card rounded-2xl p-6 border-emerald-500/20 bg-emerald-950/10"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">What You Got Right</h3>
            <p className="text-xs text-slate-400">Solid elements to keep and build on</p>
          </div>
        </div>

        <ul className="space-y-3">
          {strengths.map((strength, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-emerald-500/10 text-slate-300 text-sm leading-relaxed"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{strength}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};
