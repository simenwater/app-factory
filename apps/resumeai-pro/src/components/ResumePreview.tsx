"use client";

import type { ResumeData } from "@/types";
import { Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react";

/**
 * @description 简历实时预览组件
 * @param {Object} props
 * @param {ResumeData} props.resume - 简历数据
 */
export function ResumePreview({ resume }: { resume: ResumeData }) {
  const { personalInfo, workExperience, education, skills, projects } = resume;

  return (
    <div className="mx-auto w-full max-w-[210mm] rounded-lg border border-border bg-white p-8 shadow-sm dark:border-border-dark dark:bg-white">
      {/* Header */}
      <div className="mb-6 border-b-2 border-primary pb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {personalInfo.fullName || "Your Name"}
        </h1>
        <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail size={14} />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone size={14} />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {personalInfo.location}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin size={14} />
              {personalInfo.linkedin}
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1">
              <Globe size={14} />
              {personalInfo.website}
            </span>
          )}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-5">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-primary">
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed text-gray-700">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <section className="mb-5">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">
            Work Experience
          </h2>
          <div className="space-y-4">
            {workExperience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {exp.position}
                    </h3>
                    <p className="text-sm text-gray-600">{exp.company}</p>
                  </div>
                  <span className="shrink-0 text-xs text-gray-500">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                {exp.description && (
                  <p className="mt-1 text-sm text-gray-700">
                    {exp.description}
                  </p>
                )}
                {exp.achievements.length > 0 && (
                  <ul className="mt-1 list-inside list-disc space-y-0.5 text-sm text-gray-700">
                    {exp.achievements.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-5">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {edu.degree} in {edu.field}
                  </h3>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="text-xs text-gray-500">
                    {edu.startDate} – {edu.endDate}
                  </span>
                  {edu.gpa && (
                    <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-5">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-primary">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-5">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">
            Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id}>
                <h3 className="font-semibold text-gray-900">{proj.name}</h3>
                {proj.description && (
                  <p className="text-sm text-gray-700">{proj.description}</p>
                )}
                {proj.technologies.length > 0 && (
                  <p className="mt-0.5 text-xs text-gray-500">
                    {proj.technologies.join(" • ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
