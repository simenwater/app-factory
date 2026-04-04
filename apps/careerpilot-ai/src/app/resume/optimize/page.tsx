/**
 * @fileoverview 简历优化页面 — 上传 PDF/粘贴文本，AI 优化重写
 */
"use client";

import { useState, useCallback } from "react";
import { useStore } from "@/store/useStore";
import { optimizeResume } from "@/lib/ai";
import { parseResumeText } from "@/lib/resume";
import EmptyState from "@/components/EmptyState";
import {
  Upload,
  FileText,
  Sparkles,
  Copy,
  Check,
  Loader2,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

/**
 * @returns 简历优化功能页面
 */
export default function ResumeOptimizePage() {
  const { resumes, addResume, updateResumeOptimized, deleteResume, quota, consumeOptimization } = useStore();
  const [rawText, setRawText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [highlights, setHighlights] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [selectedResume, setSelectedResume] = useState<string | null>(null);
  const [expandedResume, setExpandedResume] = useState<string | null>(null);

  /** 处理文件上传 */
  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");

    if (file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = () => {
        const text = extractTextFromBase64(reader.result as string);
        setRawText(text);
        addResume(file.name, text);
      };
      reader.readAsDataURL(file);
    } else if (file.type === "text/plain") {
      const text = await file.text();
      setRawText(text);
      addResume(file.name, text);
    } else {
      setError("Please upload a PDF or TXT file");
    }
  }, [addResume]);

  /** 从 base64 PDF 中提取文本（简化处理） */
  const extractTextFromBase64 = (base64: string): string => {
    const text = atob(base64.split(",")[1] || "");
    const readable = text
      .replace(/[^\x20-\x7E\n\r\t]/g, " ")
      .replace(/\s{3,}/g, "\n")
      .trim();
    return readable || "Unable to parse PDF content. Please paste your resume text manually.";
  };

  /** 执行 AI 优化 */
  const handleOptimize = async () => {
    const textToOptimize = selectedResume
      ? resumes.find((r) => r.id === selectedResume)?.rawText || rawText
      : rawText;

    if (!textToOptimize.trim()) {
      setError("Please enter or upload your resume text first");
      return;
    }

    if (!consumeOptimization()) {
      setError("You've reached the free optimization limit. Please upgrade your plan.");
      return;
    }

    setLoading(true);
    setError("");
    setHighlights([]);

    try {
      const result = await optimizeResume({ resumeText: textToOptimize });
      setHighlights(result.highlights);

      if (selectedResume) {
        updateResumeOptimized(selectedResume, result.optimizedText);
      } else {
        const resume = addResume("Pasted Resume", textToOptimize);
        updateResumeOptimized(resume.id, result.optimizedText);
        setSelectedResume(resume.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Optimization failed");
    } finally {
      setLoading(false);
    }
  };

  /** 复制优化后的文本 */
  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentResume = selectedResume ? resumes.find((r) => r.id === selectedResume) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resume Optimizer</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Upload your resume and let AI enhance it for maximum impact
        </p>
      </div>

      {/* Quota info */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Sparkles className="w-4 h-4 text-indigo-500" />
        <span>
          {quota.plan === "free"
            ? `Free trial: ${quota.optimizationsLimit - quota.optimizationsUsed} of ${quota.optimizationsLimit} optimizations left`
            : "Unlimited optimizations (Premium)"}
        </span>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input panel */}
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Your Resume</h2>

            {/* File upload */}
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors mb-4">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Drop PDF/TXT or click to upload
              </span>
              <span className="text-xs text-gray-400 mt-1">Supports PDF and plain text files</span>
              <input
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <div className="relative">
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Or paste your resume text here..."
                rows={12}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>

            {error && (
              <div className="mt-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-4 py-2">
                {error}
              </div>
            )}

            <button
              onClick={handleOptimize}
              disabled={loading || (!rawText.trim() && !selectedResume)}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-xl transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Optimize with AI
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output panel */}
        <div className="space-y-4">
          {currentResume?.optimizedText ? (
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900 dark:text-white">Optimized Resume</h2>
                <button
                  onClick={() => handleCopy(currentResume.optimizedText!)}
                  className="flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="prose dark:prose-invert max-w-none text-sm whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
                {currentResume.optimizedText}
              </div>

              {highlights.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Improvements Made
                  </h3>
                  <ul className="space-y-1">
                    {highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
              <EmptyState
                icon={Sparkles}
                title="Ready to optimize"
                description="Enter your resume text and click 'Optimize with AI' to get started"
              />
            </div>
          )}

          {/* Skills extracted */}
          {rawText && (
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Skills Detected
              </h3>
              <div className="flex flex-wrap gap-2">
                {parseResumeText(rawText).skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300"
                  >
                    {skill}
                  </span>
                ))}
                {parseResumeText(rawText).skills.length === 0 && (
                  <span className="text-sm text-gray-400">No skills detected yet</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resume History */}
      {resumes.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resume History</h2>
          <div className="space-y-2">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className={`rounded-xl border bg-white dark:bg-gray-900 overflow-hidden transition-colors ${
                  selectedResume === resume.id
                    ? "border-indigo-500 dark:border-indigo-400"
                    : "border-gray-200 dark:border-gray-800"
                }`}
              >
                <div className="flex items-center justify-between p-4">
                  <button
                    onClick={() => {
                      setSelectedResume(resume.id);
                      setRawText(resume.rawText);
                    }}
                    className="flex items-center gap-3 text-left flex-1"
                  >
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white text-sm">
                        {resume.fileName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(resume.uploadedAt).toLocaleDateString()}
                        {resume.lastOptimizedAt && " · Optimized"}
                      </div>
                    </div>
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setExpandedResume(expandedResume === resume.id ? null : resume.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {expandedResume === resume.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => deleteResume(resume.id)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {expandedResume === resume.id && (
                  <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 mx-4 mb-4 rounded-lg p-3 max-h-48 overflow-y-auto">
                    {resume.optimizedText || resume.rawText}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
