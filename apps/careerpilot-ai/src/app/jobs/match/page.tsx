/**
 * @fileoverview JD 匹配分析页面 — 选择简历 + 输入 JD，获取匹配评分和建议
 */
"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { analyzeMatch } from "@/lib/ai";
import ScoreBadge from "@/components/ScoreBadge";
import EmptyState from "@/components/EmptyState";
import {
  Target,
  Loader2,
  Copy,
  Check,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  FileText,
} from "lucide-react";

/**
 * @returns JD 匹配分析页面
 */
export default function JobMatchPage() {
  const { resumes, addMatchResult, quota, consumeMatch } = useStore();
  const [resumeId, setResumeId] = useState("");
  const [manualResume, setManualResume] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    overallScore: number;
    skillMatch: number;
    experienceMatch: number;
    keywordMatch: number;
    suggestions: string[];
    matchedKeywords: string[];
    missingKeywords: string[];
    coverLetter: string;
  } | null>(null);
  const [copiedCL, setCopiedCL] = useState(false);

  /** 执行匹配分析 */
  const handleAnalyze = async () => {
    const resumeText = resumeId
      ? resumes.find((r) => r.id === resumeId)?.optimizedText || resumes.find((r) => r.id === resumeId)?.rawText
      : manualResume;

    if (!resumeText?.trim()) {
      setError("Please select a resume or paste resume text");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Please enter the job description");
      return;
    }

    if (!consumeMatch()) {
      setError("You've reached the free match limit. Please upgrade your plan.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await analyzeMatch({
        resumeText,
        jobDescription,
        jobTitle: jobTitle || "Not specified",
      });

      setResult(res);

      addMatchResult({
        resumeId: resumeId || "manual",
        jobId: "",
        overallScore: res.overallScore,
        skillMatch: res.skillMatch,
        experienceMatch: res.experienceMatch,
        keywordMatch: res.keywordMatch,
        suggestions: res.suggestions,
        matchedKeywords: res.matchedKeywords,
        missingKeywords: res.missingKeywords,
        generatedCoverLetter: res.coverLetter,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  /** 复制求职信 */
  const handleCopyCL = async () => {
    if (result?.coverLetter) {
      await navigator.clipboard.writeText(result.coverLetter);
      setCopiedCL(true);
      setTimeout(() => setCopiedCL(false), 2000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Job Match Analyzer</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Compare your resume against job descriptions to get match scores and tailored suggestions
        </p>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Target className="w-4 h-4 text-indigo-500" />
        <span>
          {quota.plan === "free"
            ? `Free trial: ${quota.matchesLimit - quota.matchesUsed} of ${quota.matchesLimit} matches left`
            : "Unlimited matches (Premium)"}
        </span>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-4">
          {/* Resume selection */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Select Resume</h2>

            {resumes.length > 0 ? (
              <select
                value={resumeId}
                onChange={(e) => setResumeId(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Paste manually below</option>
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.fileName} {r.optimizedText ? "(Optimized)" : ""}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-gray-400">No resumes uploaded. Paste your resume below.</p>
            )}

            {!resumeId && (
              <textarea
                value={manualResume}
                onChange={(e) => setManualResume(e.target.value)}
                placeholder="Paste your resume text here..."
                rows={8}
                className="mt-3 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            )}
          </div>

          {/* Job info */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Job Description</h2>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Job title"
                className="rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company"
                className="rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here..."
              rows={10}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-4 py-2">
              {error}
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-xl transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Target className="w-4 h-4" />
                Analyze Match
              </>
            )}
          </button>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {result ? (
            <>
              {/* Scores */}
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
                <div className="text-center mb-6">
                  <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Overall Match</h2>
                  <ScoreBadge score={result.overallScore} size="lg" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Skills", score: result.skillMatch },
                    { label: "Experience", score: result.experienceMatch },
                    { label: "Keywords", score: result.keywordMatch },
                  ].map(({ label, score }) => (
                    <div key={label} className="text-center">
                      <ScoreBadge score={score} size="sm" />
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Keywords */}
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Keywords Analysis</h3>
                {result.matchedKeywords.length > 0 && (
                  <div className="mb-3">
                    <div className="text-xs font-medium text-green-600 dark:text-green-400 mb-1 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Matched
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {result.matchedKeywords.map((kw) => (
                        <span key={kw} className="px-2 py-0.5 rounded-full text-xs bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {result.missingKeywords.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-red-600 dark:text-red-400 mb-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Missing
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {result.missingKeywords.map((kw) => (
                        <span key={kw} className="px-2 py-0.5 rounded-full text-xs bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Suggestions */}
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" /> Suggestions
                </h3>
                <ul className="space-y-2">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="text-indigo-500 mt-0.5">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cover Letter */}
              {result.coverLetter && (
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Generated Cover Letter</h3>
                    <button
                      onClick={handleCopyCL}
                      className="flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      {copiedCL ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copiedCL ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-64 overflow-y-auto">
                    {result.coverLetter}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
              <EmptyState
                icon={FileText}
                title="No analysis yet"
                description="Select a resume and paste a job description to analyze the match"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
