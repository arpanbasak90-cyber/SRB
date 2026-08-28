'use client';

import React, { useState } from 'react';

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
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="clean-card p-6 space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Rewritten Bullet Points</h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Action-oriented improvements ready to copy into your resume</p>
      </div>

      <div className="space-y-4">
        {bullets.map((bullet, idx) => (
          <div
            key={idx}
            className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3"
          >
            {/* Original */}
            <div className="text-xs text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-red-600 dark:text-red-400">Original: </span>
              <span className="line-through">{bullet.original}</span>
            </div>

            {/* Improved */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{bullet.improved}</span>
              <button
                onClick={() => handleCopy(bullet.improved, idx)}
                className="self-end sm:self-auto text-xs px-3 py-1.5 rounded bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-medium transition-colors shrink-0"
              >
                {copiedIndex === idx ? 'Copied!' : 'Copy'}
              </button>
            </div>

            {/* Reason */}
            <div className="text-xs text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Why: </span>
              {bullet.reason}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
