'use client';

import React, { useState, useEffect } from 'react';
import { ScoreGauge } from '@/components/ScoreGauge';
import { RoastList } from '@/components/RoastList';
import { RewrittenBullets } from '@/components/RewrittenBullets';
import { FileUpload } from '@/components/FileUpload';
import { AnalysisResponse } from '@/app/api/analyze/route';

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
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [resumeText, setResumeText] = useState<string>('');
  const [activeFileName, setActiveFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);

  // Initialize and sync theme
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const initialTheme = storedTheme || 'dark';
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);

    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  const handleLoadSample = () => {
    setResumeText(SAMPLE_RESUME);
    setActiveFileName(null);
    setError(null);
  };

  const handleClear = () => {
    setResumeText('');
    setActiveFileName(null);
    setError(null);
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim() || resumeText.trim().length < 40) {
      setError('Please upload a file or paste resume text with at least 40 characters.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze resume.');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  const wordCount = resumeText.trim() ? resumeText.trim().split(/\s+/).length : 0;
  const charCount = resumeText.length;

  return (
    <main className="min-h-screen pb-16 pt-6 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Navbar Header */}
      <header className="clean-card flex items-center justify-between p-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📑</span>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Resume Checker
          </h1>
        </div>

        {/* Light / Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          type="button"
          className="flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm cursor-pointer"
          title="Toggle Light / Dark Theme"
        >
          {theme === 'dark' ? (
            <>
              <span>☀️</span>
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <span>🌙</span>
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </header>

      {/* Main Content Area */}
      <div className="space-y-6">
        {!result ? (
          /* INPUT & UPLOAD SECTION */
          <div className="clean-card p-6 sm:p-8 space-y-6">
            <div className="space-y-2 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Check Your Resume
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Upload a PDF or Word document, or paste text directly to get instant feedback and score.
              </p>
            </div>

            {/* 1. File Upload Attachment Section */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                1. Upload Resume Document (.PDF, .DOCX, .TXT)
              </label>
              <FileUpload
                disabled={isLoading}
                onTextExtracted={(extractedText, name) => {
                  setResumeText(extractedText);
                  setActiveFileName(name);
                  setError(null);
                }}
              />
            </div>

            {/* Section Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              <span className="flex-shrink mx-4 text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest">
                OR PASTE TEXT BELOW
              </span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            </div>

            {/* 2. Text Area Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  2. Resume Text
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleLoadSample}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    Load Sample Resume
                  </button>
                  {resumeText && (
                    <>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <button
                        type="button"
                        onClick={handleClear}
                        className="text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-medium"
                      >
                        Clear
                      </button>
                    </>
                  )}
                </div>
              </div>

              {activeFileName && (
                <div className="text-xs text-emerald-700 dark:text-emerald-400 font-medium pb-1">
                  ✓ Text loaded from attached file: <strong>{activeFileName}</strong>
                </div>
              )}

              <textarea
                value={resumeText}
                onChange={(e) => {
                  setResumeText(e.target.value);
                  setActiveFileName(null);
                }}
                placeholder="Paste raw resume content here..."
                rows={10}
                disabled={isLoading}
                className="w-full rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-4 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm leading-relaxed outline-none transition-colors"
              />

              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
                <span>Minimum 40 characters required</span>
                <span>{wordCount} words | {charCount} chars</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
                ⚠️ {error}
              </div>
            )}

            {/* Submit Action */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isLoading || !resumeText.trim()}
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <span>Analyze Resume</span>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* RESULTS DASHBOARD */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Analysis Results</h2>
              <button
                onClick={handleClear}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium"
              >
                ← Check Another Resume
              </button>
            </div>

            <ScoreGauge
              score={result.score}
              grade={result.grade}
              summary={result.summary}
              isMock={result.isMock}
            />

            <RoastList
              roasts={result.roastPoints}
              strengths={result.strengths}
            />

            <RewrittenBullets
              bullets={result.rewrittenBullets}
            />
          </div>
        )}
      </div>

      <footer className="text-center pt-8 text-xs text-slate-400 dark:text-slate-600 border-t border-slate-200 dark:border-slate-800">
        Clean & Minimal AI Resume Evaluation
      </footer>
    </main>
  );
}
