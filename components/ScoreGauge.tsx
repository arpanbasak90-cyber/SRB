'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ScoreGaugeProps {
  score: number;
  grade: string;
  summary: string;
  isMock?: boolean;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, grade, summary, isMock }) => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Determine dynamic gradient color based on score rating
  const getScoreColor = (val: number) => {
    if (val >= 85) return { stroke: '#10b981', bg: 'from-emerald-500/20 to-teal-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' };
    if (val >= 70) return { stroke: '#3b82f6', bg: 'from-blue-500/20 to-indigo-500/10', text: 'text-blue-400', border: 'border-blue-500/30' };
    if (val >= 55) return { stroke: '#f59e0b', bg: 'from-amber-500/20 to-orange-500/10', text: 'text-amber-400', border: 'border-amber-500/30' };
    return { stroke: '#ef4444', bg: 'from-rose-500/20 to-red-500/10', text: 'text-rose-400', border: 'border-rose-500/30' };
  };

  const theme = getScoreColor(score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative glass-card rounded-2xl p-6 sm:p-8 bg-gradient-to-br ${theme.bg} ${theme.border}`}
    >
      {isMock && (
        <div className="absolute top-4 right-4 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs px-2.5 py-1 rounded-full font-medium tracking-wide">
          Preview Demo Mode
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
        {/* Radial SVG Score Ring */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-44 h-44 transform -rotate-90">
            {/* Background Track */}
            <circle
              cx="88"
              cy="88"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              className="text-slate-800"
              fill="transparent"
            />
            {/* Animated Score Bar */}
            <motion.circle
              cx="88"
              cy="88"
              r={radius}
              stroke={theme.stroke}
              strokeWidth="12"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Center Text */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <motion.span
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`text-4xl font-extrabold tracking-tight ${theme.text}`}
            >
              {score}
            </motion.span>
            <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold mt-0.5">
              out of 100
            </span>
          </div>
        </div>

        {/* Text Breakdown */}
        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Resume Rating
            </span>
            <span className={`text-xs px-2.5 py-0.5 rounded font-black border uppercase tracking-wider ${theme.text} ${theme.border} bg-slate-900/50`}>
              Grade {grade}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {score >= 80 ? '🔥 Strong Resume Found' : score >= 60 ? '⚡ Needs Polish & Impact' : '⚠️ Major Overhaul Recommended'}
          </h2>

          <p className="text-slate-300 text-sm leading-relaxed">
            {summary}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
