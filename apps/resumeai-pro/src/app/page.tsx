"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import {
  Sparkles,
  FileText,
  BarChart3,
  Download,
  ArrowRight,
  Trash2,
  Plus,
  Clock,
} from "lucide-react";

/**
 * @description 首页 — 展示产品特性和用户的简历列表
 */
export default function HomePage() {
  const router = useRouter();
  const { resumes, createResume, deleteResume, setCurrentResume } = useStore();

  const handleNewResume = () => {
    const id = createResume();
    setCurrentResume(id);
    router.push("/editor");
  };

  const handleOpenResume = (id: string) => {
    setCurrentResume(id);
    router.push("/editor");
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="py-12 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles size={16} />
            AI-Powered Resume Builder
          </div>
          <h1 className="mb-4 text-4xl font-bold leading-tight text-text dark:text-text-dark md:text-5xl">
            Build ATS-Friendly Resumes{" "}
            <span className="text-primary">in Minutes</span>
          </h1>
          <p className="mb-8 text-lg text-text-muted dark:text-text-muted-dark">
            Let AI craft your perfect resume. Optimized for Applicant Tracking
            Systems, tailored to job descriptions, and exported in PDF or Word
            format.
          </p>
          <button
            onClick={handleNewResume}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30"
          >
            <Plus size={20} />
            Create New Resume
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            icon: Sparkles,
            title: "AI Content Generation",
            desc: "Paste your experience and let AI generate professional, optimized resume content.",
            color: "text-primary bg-primary/10",
          },
          {
            icon: BarChart3,
            title: "ATS Score Checker",
            desc: "Get instant feedback on ATS compatibility with actionable improvement tips.",
            color: "text-success bg-success/10",
          },
          {
            icon: Download,
            title: "Multi-Format Export",
            desc: "Download your resume as PDF or Word document, ready to submit.",
            color: "text-accent bg-accent/10",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg dark:border-border-dark dark:bg-card-dark"
          >
            <div
              className={`mb-4 inline-flex rounded-xl p-3 ${f.color}`}
            >
              <f.icon size={24} />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-text dark:text-text-dark">
              {f.title}
            </h3>
            <p className="text-sm text-text-muted dark:text-text-muted-dark">
              {f.desc}
            </p>
          </div>
        ))}
      </section>

      {/* Resume List */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-text dark:text-text-dark">
            Your Resumes
          </h2>
          <button
            onClick={handleNewResume}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
          >
            <Plus size={16} />
            New Resume
          </button>
        </div>

        {resumes.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border py-16 text-center dark:border-border-dark">
            <FileText
              size={48}
              className="mx-auto mb-4 text-text-muted dark:text-text-muted-dark"
            />
            <p className="mb-2 text-text-muted dark:text-text-muted-dark">
              No resumes yet
            </p>
            <p className="text-sm text-text-muted dark:text-text-muted-dark">
              Create your first resume to get started
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resumes.map((r) => (
              <div
                key={r.id}
                className="group cursor-pointer rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md dark:border-border-dark dark:bg-card-dark"
                onClick={() => handleOpenResume(r.id)}
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText size={20} />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteResume(r.id);
                    }}
                    className="rounded-lg p-1.5 text-text-muted opacity-0 transition-all hover:bg-danger/10 hover:text-danger group-hover:opacity-100 dark:text-text-muted-dark"
                    aria-label="Delete resume"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <h3 className="mb-1 font-semibold text-text dark:text-text-dark">
                  {r.title}
                </h3>
                <p className="mb-2 text-sm text-text-muted dark:text-text-muted-dark">
                  {r.personalInfo.fullName || "No name set"}
                </p>
                <div className="flex items-center gap-1 text-xs text-text-muted dark:text-text-muted-dark">
                  <Clock size={12} />
                  {new Date(r.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
