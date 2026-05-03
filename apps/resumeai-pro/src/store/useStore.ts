"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type {
  ResumeData,
  PersonalInfo,
  WorkExperience,
  Education,
  Skill,
  Project,
  TemplateType,
  Settings,
} from "@/types";

/**
 * @description 创建空简历数据
 * @returns {ResumeData} 空简历数据
 */
export function createEmptyResume(): ResumeData {
  const now = new Date().toISOString();
  return {
    id: uuidv4(),
    title: "Untitled Resume",
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      website: "",
      summary: "",
    },
    workExperience: [],
    education: [],
    skills: [],
    projects: [],
    template: "professional",
    createdAt: now,
    updatedAt: now,
  };
}

/** @description Store 状态 */
interface StoreState {
  resumes: ResumeData[];
  currentResumeId: string | null;
  settings: Settings;

  createResume: () => string;
  deleteResume: (id: string) => void;
  setCurrentResume: (id: string) => void;
  getCurrentResume: () => ResumeData | null;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  addWorkExperience: (exp: Omit<WorkExperience, "id">) => void;
  updateWorkExperience: (id: string, exp: Partial<WorkExperience>) => void;
  removeWorkExperience: (id: string) => void;
  addEducation: (edu: Omit<Education, "id">) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addSkill: (skill: Omit<Skill, "id">) => void;
  removeSkill: (id: string) => void;
  addProject: (project: Omit<Project, "id">) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  removeProject: (id: string) => void;
  setTemplate: (template: TemplateType) => void;
  setResumeTitle: (title: string) => void;
  replaceResumeData: (data: Partial<ResumeData>) => void;
  toggleDarkMode: () => void;
  setSettings: (settings: Partial<Settings>) => void;
}

/**
 * @description 更新当前简历的辅助函数
 */
function updateCurrentResume(
  state: StoreState,
  updater: (resume: ResumeData) => ResumeData
): Partial<StoreState> {
  if (!state.currentResumeId) return {};
  return {
    resumes: state.resumes.map((r) =>
      r.id === state.currentResumeId
        ? updater({ ...r, updatedAt: new Date().toISOString() })
        : r
    ),
  };
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      resumes: [],
      currentResumeId: null,
      settings: {
        darkMode: false,
        language: "en",
      },

      createResume: () => {
        const resume = createEmptyResume();
        set((state) => ({
          resumes: [...state.resumes, resume],
          currentResumeId: resume.id,
        }));
        return resume.id;
      },

      deleteResume: (id) =>
        set((state) => ({
          resumes: state.resumes.filter((r) => r.id !== id),
          currentResumeId:
            state.currentResumeId === id ? null : state.currentResumeId,
        })),

      setCurrentResume: (id) => set({ currentResumeId: id }),

      getCurrentResume: () => {
        const state = get();
        return (
          state.resumes.find((r) => r.id === state.currentResumeId) ?? null
        );
      },

      updatePersonalInfo: (info) =>
        set((state) =>
          updateCurrentResume(state, (r) => ({
            ...r,
            personalInfo: { ...r.personalInfo, ...info },
          }))
        ),

      addWorkExperience: (exp) =>
        set((state) =>
          updateCurrentResume(state, (r) => ({
            ...r,
            workExperience: [
              ...r.workExperience,
              { ...exp, id: uuidv4() },
            ],
          }))
        ),

      updateWorkExperience: (id, exp) =>
        set((state) =>
          updateCurrentResume(state, (r) => ({
            ...r,
            workExperience: r.workExperience.map((w) =>
              w.id === id ? { ...w, ...exp } : w
            ),
          }))
        ),

      removeWorkExperience: (id) =>
        set((state) =>
          updateCurrentResume(state, (r) => ({
            ...r,
            workExperience: r.workExperience.filter((w) => w.id !== id),
          }))
        ),

      addEducation: (edu) =>
        set((state) =>
          updateCurrentResume(state, (r) => ({
            ...r,
            education: [...r.education, { ...edu, id: uuidv4() }],
          }))
        ),

      updateEducation: (id, edu) =>
        set((state) =>
          updateCurrentResume(state, (r) => ({
            ...r,
            education: r.education.map((e) =>
              e.id === id ? { ...e, ...edu } : e
            ),
          }))
        ),

      removeEducation: (id) =>
        set((state) =>
          updateCurrentResume(state, (r) => ({
            ...r,
            education: r.education.filter((e) => e.id !== id),
          }))
        ),

      addSkill: (skill) =>
        set((state) =>
          updateCurrentResume(state, (r) => ({
            ...r,
            skills: [...r.skills, { ...skill, id: uuidv4() }],
          }))
        ),

      removeSkill: (id) =>
        set((state) =>
          updateCurrentResume(state, (r) => ({
            ...r,
            skills: r.skills.filter((s) => s.id !== id),
          }))
        ),

      addProject: (project) =>
        set((state) =>
          updateCurrentResume(state, (r) => ({
            ...r,
            projects: [...r.projects, { ...project, id: uuidv4() }],
          }))
        ),

      updateProject: (id, project) =>
        set((state) =>
          updateCurrentResume(state, (r) => ({
            ...r,
            projects: r.projects.map((p) =>
              p.id === id ? { ...p, ...project } : p
            ),
          }))
        ),

      removeProject: (id) =>
        set((state) =>
          updateCurrentResume(state, (r) => ({
            ...r,
            projects: r.projects.filter((p) => p.id !== id),
          }))
        ),

      setTemplate: (template) =>
        set((state) =>
          updateCurrentResume(state, (r) => ({ ...r, template }))
        ),

      setResumeTitle: (title) =>
        set((state) =>
          updateCurrentResume(state, (r) => ({ ...r, title }))
        ),

      replaceResumeData: (data) =>
        set((state) =>
          updateCurrentResume(state, (r) => ({ ...r, ...data }))
        ),

      toggleDarkMode: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            darkMode: !state.settings.darkMode,
          },
        })),

      setSettings: (settings) =>
        set((state) => ({
          settings: { ...state.settings, ...settings },
        })),
    }),
    {
      name: "resumeai-pro-storage",
    }
  )
);
