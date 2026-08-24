'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';
import mammoth from 'mammoth';

interface FileUploadProps {
  onTextExtracted: (text: string, fileName: string) => void;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onTextExtracted, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setError(null);
    setIsExtracting(true);
    setFileName(file.name);

    try {
      const ext = file.name.split('.').pop()?.toLowerCase();

      if (ext === 'txt' || ext === 'md' || ext === 'rtf') {
        const text = await file.text();
        if (!text.trim()) throw new Error('Selected text file is empty.');
        onTextExtracted(text, file.name);
      } else if (ext === 'docx') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        const extractedText = result.value;
        if (!extractedText.trim()) throw new Error('Could not extract readable text from DOCX file.');
        onTextExtracted(extractedText, file.name);
      } else if (ext === 'pdf') {
        // Dynamic import pdfjs-dist for client side execution
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
          fullText += pageText + '\n';
        }

        if (!fullText.trim()) {
          throw new Error('PDF file appears to be empty or contains scanned images without selectable text.');
        }

        onTextExtracted(fullText, file.name);
      } else {
        throw new Error('Unsupported file format. Please upload a PDF, DOCX, or TXT file.');
      }
    } catch (err: any) {
      console.error('File parsing error:', err);
      setError(err.message || 'Failed to read file contents.');
      setFileName(null);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFileName(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      <div
        onClick={() => !disabled && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
            : 'border-slate-800 hover:border-indigo-500/50 bg-slate-900/40 hover:bg-slate-900/80'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt,.md,.rtf"
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          {isExtracting ? (
            <div className="flex items-center gap-2 text-indigo-400">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-sm font-semibold">Extracting resume text...</span>
            </div>
          ) : fileName ? (
            <div className="flex items-center gap-3 text-emerald-400 bg-emerald-950/30 px-3.5 py-2 rounded-lg border border-emerald-500/30 text-sm font-medium">
              <FileText className="w-4 h-4 shrink-0" />
              <span className="truncate max-w-xs">{fileName}</span>
              <button
                onClick={clearFile}
                className="hover:text-rose-400 transition-colors p-1"
                title="Remove attachment"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">
                  <span className="text-indigo-400 underline decoration-indigo-400/50 underline-offset-2">Click to upload</span> or drag and drop your resume file
                </p>
                <p className="text-xs text-slate-500 mt-1">Supports PDF, DOCX, TXT, or MD files (max 10MB)</p>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-950/30 p-2.5 rounded-lg border border-rose-500/30">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
