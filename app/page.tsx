'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScoreGauge } from '@/components/ScoreGauge';
import { RoastList } from '@/components/RoastList';
import { RewrittenBullets } from '@/components/RewrittenBullets';
import { AnalysisResponse } from '@/app/api/analyze/route';
import {
  FileText,
  Sparkles,
  Zap,
  RotateCcw,
  AlertCircle,
  Wand2,
  CheckCircle2,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

const SAMPLE_RESUME = `Jane Doe
Senior Full Stack Developer | jane.doe@example.com

SUMMARY
Passionate web developer with experience in building web applications using React, Node.js, and SQL. Responsible for helping team write code and maintain client servers.

EXPERIENCE
Software Engineer | Acme Tech Solutions (2021 - Present)
• Responsible for maintaining company website and fixing reported bugs.
• Worked on user interfaces and updated CSS styles for client portals.
• Helped database team with SQL queries and server maintenance.
• Collaborated with team members to deliver sprint goals on time.

Web Developer | Creative Apps Studio (2019 - 2021)
• Created responsive web pages using HTML, CSS, and JavaScript.
• Handled frontend bugs and assisted backend developers.
• Participated in weekly client meetings to present project updates.

SKILLS
React, JavaScript, TypeScript, Node.js, Express, PostgreSQL, HTML, CSS, Git`;

export default function Home() {
  const [resumeText, setResumeText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);

  const handleLoadSample = () => {
    setResumeText(SAMPLE_RESUME);
    setError(null);
  };

  const handleClear = () => {
    setResumeText('');
    setError(null);
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim() || resumeText.trim().length < 40) {
      setError('Please paste a resume snippet with at least 40 characters.');
      return;
    }

    setError(null);
    setIsLoading(true);
    setLoadingStep(0);

    // Simulate loading steps for engaging UI feel
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < 2 ? prev + 1 : prev));
    }, 900);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process resume analysis.');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  };

  const wordCount = resumeText.trim() ? resumeText.trim().split(/\s+/).length : 0;
  const charCount = resumeText.length;

  return (
    <main className="min-h-screen pb-20 pt-8 sm:pt-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      {/* Top Navigation & Header Branding */}
      <header className="flex flex-col items-center text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide"
        >
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Zero Login • 100% Free AI Resume Checker</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-none"
        >
          Roast & Polish Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Resume in Seconds</span>
        </motion.h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
          Paste your resume text to get an instant AI score, sharp critique points, and rewritten high-impact bullet points all in one view.
        </p>
      </header>

      {/* Main Container */}
      <div className="space-y-8">
        {!result ? (
          /* INPUT SECTION */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl border-slate-800"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-bold text-white">Paste Resume Text</h2>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors font-medium border border-slate-700"
                >
                  <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Try Sample Resume</span>
                </button>
                {resumeText && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 transition-colors font-medium"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Textarea Input */}
            <div className="relative">
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your raw resume text here (experience, bullet points, skills, summary)..."
                rows={12}
                disabled={isLoading}
                className="w-full rounded-xl bg-slate-900/90 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-4 text-slate-200 text-sm leading-relaxed placeholder-slate-500 outline-none transition-all resize-y font-mono"
              />

              <div className="mt-2 flex items-center justify-between text-xs text-slate-500 px-1">
                <span>Min 40 chars required</span>
                <span>{wordCount} words | {charCount} characters</span>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Submit Action */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Private & Secure • Direct AI API Processing</span>
              </div>

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isLoading || !resumeText.trim()}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Analyzing Resume...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                    <span>Analyze & Roast Resume</span>
                  </>
                )}
              </button>
            </div>

            {/* Loading Indicator Steps */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-4 rounded-xl bg-slate-900/60 border border-indigo-500/20 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs text-indigo-300 font-semibold">
                    <span>AI Review in Progress</span>
                    <span>Step {loadingStep + 1} of 3</span>
                  </div>

                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                      initial={{ width: '20%' }}
                      animate={{ width: `${(loadingStep + 1) * 33.3}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>

                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    {loadingStep === 0 && <span>Scanning wording, structure, and action verbs...</span>}
                    {loadingStep === 1 && <span>Evaluating ATS impact and calculating resume score...</span>}
                    {loadingStep === 2 && <span>Drafting witty roast points and rewriting weak bullet points...</span>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* RESULTS DASHBOARD */
          <div className="space-y-8">
            {/* Top Action Bar */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h2 className="text-xl font-bold text-white">Analysis Complete</h2>
              </div>

              <button
                onClick={handleClear}
                className="flex items-center gap-2 text-xs px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
                <span>Check Another Resume</span>
              </button>
            </div>

            {/* Score Gauge Card */}
            <ScoreGauge
              score={result.score}
              grade={result.grade}
              summary={result.summary}
              isMock={result.isMock}
            />

            {/* Roast & Strengths Section */}
            <RoastList
              roasts={result.roastPoints}
              strengths={result.strengths}
            />

            {/* Rewritten Bullet Cards */}
            <RewrittenBullets
              bullets={result.rewrittenBullets}
            />
          </div>
        )}
      </div>

      {/* Simple Footer */}
      <footer className="text-center pt-12 text-xs text-slate-500 border-t border-slate-900">
        <p>Built with Next.js & Serverless AI Integration • Direct single round-trip evaluation</p>
      </footer>
    </main>
  );
}
