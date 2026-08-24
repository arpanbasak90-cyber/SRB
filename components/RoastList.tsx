'use client';

import React from 'react';

interface RoastListProps {
  roasts: string[];
  strengths: string[];
}

export const RoastList: React.FC<RoastListProps> = ({ roasts, strengths }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Roast Points */}
      <div className="clean-card p-6 space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Weaknesses & Roast Points</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Issues and weak phrasing to address</p>
        </div>

        <ul className="space-y-2.5">
          {roasts.map((roast, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm leading-relaxed"
            >
              <span className="text-red-500 font-bold text-xs shrink-0 mt-0.5">•</span>
              <span>{roast}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Strengths */}
      <div className="clean-card p-6 space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Key Strengths</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Positive aspects identified in your resume</p>
        </div>

        <ul className="space-y-2.5">
          {strengths.map((strength, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm leading-relaxed"
            >
              <span className="text-emerald-500 font-bold text-xs shrink-0 mt-0.5">✓</span>
              <span>{strength}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
