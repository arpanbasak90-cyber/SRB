'use client';

import React from 'react';

interface ScoreGaugeProps {
  score: number;
  grade: string;
  summary: string;
  isMock?: boolean;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, grade, summary, isMock }) => {
  const getBadgeStyle = (val: number) => {
    if (val >= 80) return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60';
    if (val >= 65) return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/60';
    if (val >= 50) return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/60';
    return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800/60';
  };

  return (
    <div className="clean-card p-6 sm:p-8 space-y-6">
      {isMock && (
        <div className="text-right">
          <span className="text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            Preview Demo Mode
          </span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
        {/* Simple Score Pill / Circle */}
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 min-w-[140px] text-center shrink-0">
          <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">{score}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">/ 100 Score</span>
          <span className={`mt-3 text-xs font-bold px-3 py-1 rounded-full border ${getBadgeStyle(score)}`}>
            Grade {grade}
          </span>
        </div>

        {/* Breakdown Text */}
        <div className="flex-1 space-y-3 text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {score >= 80 ? 'Solid Resume Structure' : score >= 65 ? 'Needs Actionable Impact' : 'Needs Significant Revision'}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            {summary}
          </p>
        </div>
      </div>
    </div>
  );
};
