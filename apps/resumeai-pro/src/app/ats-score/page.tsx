"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { calculateATSScore } from "@/lib/ai";
import { ATSScoreCard } from "@/components/ATSScoreCard";
import type { ATSScoreResult } from "@/types";
import { BarChart3, Loader2, Search } from "lucide-react";

/**
 * @description ATS 评分检测页面
 */
export default function ATSScorePage() {
  const router = useRouter();
  const store = useStore();
  const resume = store.getCurrentResume();
  const [jobDescription, setJobDescription] = useState("");
  const [scoreResult, setScoreResult] = useState<ATSScoreResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleCheck = async () => {
    if (!resume) return;
    setIsChecking(true);
    try {
      const result = calculateATSScore(
        resume,
        jobDescription || undefined
      );
      setScoreResult(result);
    } catch (err) {
      console.error("ATS check failed:", err);
    } finally {
      setIsChecking(false);
    }
  };

  if (!resume) {
    return (
      <div className="py-20 text-center">
        <BarChart3
          size={48}
          className="mx-auto mb-4 text-text-muted dark:text-text-muted-dark"
        />
        <p className="mb-2 text-lg font-medium text-text dark:text-text-dark">
          No Resume to Analyze
        </p>
        <p className="mb-6 text-text-muted dark:text-text-muted-dark">
          Create or select a resume first to check its ATS compatibility.
        </p>
        <button
          onClick={() => {
            store.createResume();
            router.push("/editor");
          }}
          className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white"
        >
          Create Resume
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text dark:text-text-dark">
          ATS Compatibility Checker
        </h1>
        <p className="mt-1 text-text-muted dark:text-text-muted-dark">
          Check how well your resume &quot;{resume.title}&quot; will perform
          with Applicant Tracking Systems.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 dark:border-border-dark dark:bg-card-dark">
        <label className="mb-2 block text-sm font-medium text-text dark:text-text-dark">
          Job Description (Optional)
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here for keyword matching analysis..."
          className="mb-4 min-h-[120px] w-full resize-y rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-surface-dark dark:text-text-dark"
        />
        <button
          onClick={handleCheck}
          disabled={isChecking}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isChecking ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Search size={16} />
              Check ATS Score
            </>
          )}
        </button>
      </div>

      {scoreResult && <ATSScoreCard result={scoreResult} />}
    </div>
  );
}
