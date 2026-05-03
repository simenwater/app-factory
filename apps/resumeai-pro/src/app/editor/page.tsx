"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { ResumePreview } from "@/components/ResumePreview";
import { generateResumeContent } from "@/lib/ai";
import { exportResume } from "@/lib/export";
import type { ExportFormat } from "@/types";
import {
  Sparkles,
  Download,
  Eye,
  Edit3,
  Plus,
  Trash2,
  Loader2,
  ChevronDown,
  ChevronUp,
  FileText,
  FileDown,
} from "lucide-react";

/**
 * @description 简历编辑器页面 — 核心功能页，支持 AI 生成和手动编辑
 */
export default function EditorPage() {
  const router = useRouter();
  const store = useStore();
  const resume = store.getCurrentResume();
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [aiInput, setAiInput] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["personal", "experience", "education", "skills", "projects"])
  );

  if (!resume) {
    return (
      <div className="py-20 text-center">
        <FileText
          size={48}
          className="mx-auto mb-4 text-text-muted dark:text-text-muted-dark"
        />
        <p className="mb-4 text-text-muted dark:text-text-muted-dark">
          No resume selected
        </p>
        <button
          onClick={() => {
            store.createResume();
            router.refresh();
          }}
          className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white"
        >
          Create New Resume
        </button>
      </div>
    );
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  const handleAIGenerate = async () => {
    if (!aiInput.trim()) return;
    setIsGenerating(true);
    try {
      const result = await generateResumeContent(aiInput, jobDesc || undefined);
      store.replaceResumeData(result);
    } catch (err) {
      console.error("AI generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async (format: ExportFormat) => {
    await exportResume(resume, format);
  };

  const SectionHeader = ({
    id,
    title,
    count,
  }: {
    id: string;
    title: string;
    count?: number;
  }) => (
    <button
      onClick={() => toggleSection(id)}
      className="flex w-full items-center justify-between rounded-xl bg-card px-4 py-3 text-left transition-colors hover:bg-primary/5 dark:bg-card-dark"
    >
      <span className="text-sm font-semibold text-text dark:text-text-dark">
        {title}
        {count !== undefined && (
          <span className="ml-2 text-xs text-text-muted dark:text-text-muted-dark">
            ({count})
          </span>
        )}
      </span>
      {expandedSections.has(id) ? (
        <ChevronUp size={16} className="text-text-muted" />
      ) : (
        <ChevronDown size={16} className="text-text-muted" />
      )}
    </button>
  );

  const inputClass =
    "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-surface-dark dark:text-text-dark";

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <input
          type="text"
          value={resume.title}
          onChange={(e) => store.setResumeTitle(e.target.value)}
          className="border-b border-transparent bg-transparent text-xl font-bold text-text outline-none focus:border-primary dark:text-text-dark"
          placeholder="Resume Title"
        />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAiPanel(!showAiPanel)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              showAiPanel
                ? "bg-accent text-white"
                : "bg-accent/10 text-accent hover:bg-accent/20"
            }`}
          >
            <Sparkles size={16} />
            AI Generate
          </button>
          <div className="flex items-center rounded-lg border border-border dark:border-border-dark">
            <button
              onClick={() => setActiveTab("edit")}
              className={`inline-flex items-center gap-1.5 rounded-l-lg px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === "edit"
                  ? "bg-primary text-white"
                  : "text-text-muted hover:text-text dark:text-text-muted-dark"
              }`}
            >
              <Edit3 size={14} />
              Edit
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`inline-flex items-center gap-1.5 rounded-r-lg px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === "preview"
                  ? "bg-primary text-white"
                  : "text-text-muted hover:text-text dark:text-text-muted-dark"
              }`}
            >
              <Eye size={14} />
              Preview
            </button>
          </div>
          <div className="relative">
            <button
              onClick={() => handleExport("pdf")}
              className="inline-flex items-center gap-1.5 rounded-lg bg-success/10 px-3 py-2 text-sm font-medium text-success transition-colors hover:bg-success/20"
            >
              <FileDown size={16} />
              PDF
            </button>
          </div>
          <button
            onClick={() => handleExport("docx")}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
          >
            <Download size={16} />
            Word
          </button>
        </div>
      </div>

      {/* AI Panel */}
      {showAiPanel && (
        <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-text dark:text-text-dark">
            <Sparkles size={16} className="text-accent" />
            AI Resume Generator
          </h3>
          <textarea
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            placeholder="Paste your work experience, skills, education, or any information about yourself. AI will structure it into a professional resume..."
            className={`${inputClass} mb-3 min-h-[120px] resize-y`}
          />
          <textarea
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="(Optional) Paste the job description to tailor your resume..."
            className={`${inputClass} mb-3 min-h-[80px] resize-y`}
          />
          <button
            onClick={handleAIGenerate}
            disabled={isGenerating || !aiInput.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Generate Resume
              </>
            )}
          </button>
        </div>
      )}

      {/* Content Area */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Editor */}
        <div
          className={`space-y-3 ${activeTab === "preview" ? "hidden lg:block" : ""}`}
        >
          {/* Personal Info */}
          <SectionHeader id="personal" title="Personal Information" />
          {expandedSections.has("personal") && (
            <div className="space-y-3 rounded-xl border border-border bg-card p-4 dark:border-border-dark dark:bg-card-dark">
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className={inputClass}
                  placeholder="Full Name"
                  value={resume.personalInfo.fullName}
                  onChange={(e) =>
                    store.updatePersonalInfo({ fullName: e.target.value })
                  }
                />
                <input
                  className={inputClass}
                  placeholder="Email"
                  type="email"
                  value={resume.personalInfo.email}
                  onChange={(e) =>
                    store.updatePersonalInfo({ email: e.target.value })
                  }
                />
                <input
                  className={inputClass}
                  placeholder="Phone"
                  value={resume.personalInfo.phone}
                  onChange={(e) =>
                    store.updatePersonalInfo({ phone: e.target.value })
                  }
                />
                <input
                  className={inputClass}
                  placeholder="Location"
                  value={resume.personalInfo.location}
                  onChange={(e) =>
                    store.updatePersonalInfo({ location: e.target.value })
                  }
                />
                <input
                  className={inputClass}
                  placeholder="LinkedIn URL"
                  value={resume.personalInfo.linkedin || ""}
                  onChange={(e) =>
                    store.updatePersonalInfo({ linkedin: e.target.value })
                  }
                />
                <input
                  className={inputClass}
                  placeholder="Website URL"
                  value={resume.personalInfo.website || ""}
                  onChange={(e) =>
                    store.updatePersonalInfo({ website: e.target.value })
                  }
                />
              </div>
              <textarea
                className={`${inputClass} min-h-[80px] resize-y`}
                placeholder="Professional Summary"
                value={resume.personalInfo.summary}
                onChange={(e) =>
                  store.updatePersonalInfo({ summary: e.target.value })
                }
              />
            </div>
          )}

          {/* Work Experience */}
          <SectionHeader
            id="experience"
            title="Work Experience"
            count={resume.workExperience.length}
          />
          {expandedSections.has("experience") && (
            <div className="space-y-3">
              {resume.workExperience.map((exp) => (
                <div
                  key={exp.id}
                  className="rounded-xl border border-border bg-card p-4 dark:border-border-dark dark:bg-card-dark"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-text dark:text-text-dark">
                      {exp.position || "New Position"}
                    </span>
                    <button
                      onClick={() => store.removeWorkExperience(exp.id)}
                      className="text-text-muted hover:text-danger dark:text-text-muted-dark"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      className={inputClass}
                      placeholder="Position"
                      value={exp.position}
                      onChange={(e) =>
                        store.updateWorkExperience(exp.id, {
                          position: e.target.value,
                        })
                      }
                    />
                    <input
                      className={inputClass}
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) =>
                        store.updateWorkExperience(exp.id, {
                          company: e.target.value,
                        })
                      }
                    />
                    <input
                      className={inputClass}
                      placeholder="Start Date"
                      value={exp.startDate}
                      onChange={(e) =>
                        store.updateWorkExperience(exp.id, {
                          startDate: e.target.value,
                        })
                      }
                    />
                    <input
                      className={inputClass}
                      placeholder="End Date"
                      value={exp.endDate}
                      onChange={(e) =>
                        store.updateWorkExperience(exp.id, {
                          endDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <label className="mt-2 flex items-center gap-2 text-sm text-text-muted dark:text-text-muted-dark">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) =>
                        store.updateWorkExperience(exp.id, {
                          current: e.target.checked,
                        })
                      }
                      className="rounded"
                    />
                    Currently working here
                  </label>
                  <textarea
                    className={`${inputClass} mt-3 min-h-[60px] resize-y`}
                    placeholder="Description"
                    value={exp.description}
                    onChange={(e) =>
                      store.updateWorkExperience(exp.id, {
                        description: e.target.value,
                      })
                    }
                  />
                  <textarea
                    className={`${inputClass} mt-2 min-h-[60px] resize-y`}
                    placeholder="Achievements (one per line)"
                    value={exp.achievements.join("\n")}
                    onChange={(e) =>
                      store.updateWorkExperience(exp.id, {
                        achievements: e.target.value
                          .split("\n")
                          .filter((a) => a.trim()),
                      })
                    }
                  />
                </div>
              ))}
              <button
                onClick={() =>
                  store.addWorkExperience({
                    company: "",
                    position: "",
                    startDate: "",
                    endDate: "",
                    current: false,
                    description: "",
                    achievements: [],
                  })
                }
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-border py-3 text-sm font-medium text-text-muted transition-colors hover:border-primary hover:text-primary dark:border-border-dark dark:text-text-muted-dark"
              >
                <Plus size={16} />
                Add Work Experience
              </button>
            </div>
          )}

          {/* Education */}
          <SectionHeader
            id="education"
            title="Education"
            count={resume.education.length}
          />
          {expandedSections.has("education") && (
            <div className="space-y-3">
              {resume.education.map((edu) => (
                <div
                  key={edu.id}
                  className="rounded-xl border border-border bg-card p-4 dark:border-border-dark dark:bg-card-dark"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-text dark:text-text-dark">
                      {edu.degree || "New Education"}
                    </span>
                    <button
                      onClick={() => store.removeEducation(edu.id)}
                      className="text-text-muted hover:text-danger dark:text-text-muted-dark"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      className={inputClass}
                      placeholder="Institution"
                      value={edu.institution}
                      onChange={(e) =>
                        store.updateEducation(edu.id, {
                          institution: e.target.value,
                        })
                      }
                    />
                    <input
                      className={inputClass}
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={(e) =>
                        store.updateEducation(edu.id, {
                          degree: e.target.value,
                        })
                      }
                    />
                    <input
                      className={inputClass}
                      placeholder="Field of Study"
                      value={edu.field}
                      onChange={(e) =>
                        store.updateEducation(edu.id, {
                          field: e.target.value,
                        })
                      }
                    />
                    <input
                      className={inputClass}
                      placeholder="GPA"
                      value={edu.gpa || ""}
                      onChange={(e) =>
                        store.updateEducation(edu.id, {
                          gpa: e.target.value,
                        })
                      }
                    />
                    <input
                      className={inputClass}
                      placeholder="Start Date"
                      value={edu.startDate}
                      onChange={(e) =>
                        store.updateEducation(edu.id, {
                          startDate: e.target.value,
                        })
                      }
                    />
                    <input
                      className={inputClass}
                      placeholder="End Date"
                      value={edu.endDate}
                      onChange={(e) =>
                        store.updateEducation(edu.id, {
                          endDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() =>
                  store.addEducation({
                    institution: "",
                    degree: "",
                    field: "",
                    startDate: "",
                    endDate: "",
                    gpa: "",
                  })
                }
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-border py-3 text-sm font-medium text-text-muted transition-colors hover:border-primary hover:text-primary dark:border-border-dark dark:text-text-muted-dark"
              >
                <Plus size={16} />
                Add Education
              </button>
            </div>
          )}

          {/* Skills */}
          <SectionHeader
            id="skills"
            title="Skills"
            count={resume.skills.length}
          />
          {expandedSections.has("skills") && (
            <div className="rounded-xl border border-border bg-card p-4 dark:border-border-dark dark:bg-card-dark">
              <div className="mb-3 flex flex-wrap gap-2">
                {resume.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                  >
                    {skill.name}
                    <button
                      onClick={() => store.removeSkill(skill.id)}
                      className="text-primary/60 hover:text-danger"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  id="skill-input"
                  className={inputClass}
                  placeholder="Type a skill and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const input = e.currentTarget;
                      const value = input.value.trim();
                      if (value) {
                        store.addSkill({ name: value, level: "intermediate" });
                        input.value = "";
                      }
                    }
                  }}
                />
              </div>
            </div>
          )}

          {/* Projects */}
          <SectionHeader
            id="projects"
            title="Projects"
            count={resume.projects.length}
          />
          {expandedSections.has("projects") && (
            <div className="space-y-3">
              {resume.projects.map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-xl border border-border bg-card p-4 dark:border-border-dark dark:bg-card-dark"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-text dark:text-text-dark">
                      {proj.name || "New Project"}
                    </span>
                    <button
                      onClick={() => store.removeProject(proj.id)}
                      className="text-text-muted hover:text-danger dark:text-text-muted-dark"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      className={inputClass}
                      placeholder="Project Name"
                      value={proj.name}
                      onChange={(e) =>
                        store.updateProject(proj.id, {
                          name: e.target.value,
                        })
                      }
                    />
                    <input
                      className={inputClass}
                      placeholder="URL"
                      value={proj.url || ""}
                      onChange={(e) =>
                        store.updateProject(proj.id, {
                          url: e.target.value,
                        })
                      }
                    />
                  </div>
                  <textarea
                    className={`${inputClass} mt-3 min-h-[60px] resize-y`}
                    placeholder="Description"
                    value={proj.description}
                    onChange={(e) =>
                      store.updateProject(proj.id, {
                        description: e.target.value,
                      })
                    }
                  />
                  <input
                    className={`${inputClass} mt-2`}
                    placeholder="Technologies (comma-separated)"
                    value={proj.technologies.join(", ")}
                    onChange={(e) =>
                      store.updateProject(proj.id, {
                        technologies: e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </div>
              ))}
              <button
                onClick={() =>
                  store.addProject({
                    name: "",
                    description: "",
                    technologies: [],
                    url: "",
                  })
                }
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-border py-3 text-sm font-medium text-text-muted transition-colors hover:border-primary hover:text-primary dark:border-border-dark dark:text-text-muted-dark"
              >
                <Plus size={16} />
                Add Project
              </button>
            </div>
          )}
        </div>

        {/* Preview */}
        <div
          className={`${activeTab === "edit" ? "hidden lg:block" : ""}`}
        >
          <div className="sticky top-20">
            <div className="mb-3 text-sm font-medium text-text-muted dark:text-text-muted-dark">
              Live Preview
            </div>
            <div className="max-h-[calc(100vh-120px)] overflow-y-auto rounded-xl border border-border shadow-sm dark:border-border-dark">
              <ResumePreview resume={resume} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
