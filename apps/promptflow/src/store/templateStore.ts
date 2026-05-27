import { create } from 'zustand';
import type { PromptTemplate, TemplateCategory, AIPlatform, VersionEntry } from '@/types';
import { DEFAULT_TEMPLATES } from '@/lib/defaultTemplates';
import { generateId } from '@/lib/utils';

/** @description 模板筛选条件 */
export interface TemplateFilters {
  search: string;
  category: TemplateCategory | 'all';
  platform: AIPlatform | 'all';
  showFavoritesOnly: boolean;
  showSharedOnly: boolean;
}

/** @description 模板 Store 状态接口 */
interface TemplateState {
  templates: PromptTemplate[];
  filters: TemplateFilters;
  selectedTemplateId: string | null;
  isEditing: boolean;
  editingContent: string;

  setFilter: (filters: Partial<TemplateFilters>) => void;
  selectTemplate: (id: string | null) => void;
  setEditing: (isEditing: boolean) => void;
  setEditingContent: (content: string) => void;

  addTemplate: (template: Omit<PromptTemplate, 'id' | 'createdAt' | 'updatedAt' | 'versions'>) => PromptTemplate;
  updateTemplate: (id: string, updates: Partial<PromptTemplate>) => void;
  deleteTemplate: (id: string) => void;
  duplicateTemplate: (id: string) => PromptTemplate | null;
  toggleFavorite: (id: string) => void;
  toggleShared: (id: string) => void;

  saveVersion: (id: string, message: string) => void;
  restoreVersion: (templateId: string, versionId: string) => void;

  getFilteredTemplates: () => PromptTemplate[];
  getSelectedTemplate: () => PromptTemplate | undefined;
  getTemplatesByCategory: (category: TemplateCategory) => PromptTemplate[];

  importTemplates: (templates: PromptTemplate[]) => void;
}

/** @description 模板管理全局 Store */
export const useTemplateStore = create<TemplateState>((set, get) => ({
  templates: DEFAULT_TEMPLATES,
  filters: {
    search: '',
    category: 'all',
    platform: 'all',
    showFavoritesOnly: false,
    showSharedOnly: false,
  },
  selectedTemplateId: null,
  isEditing: false,
  editingContent: '',

  setFilter: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  selectTemplate: (id) =>
    set(() => ({
      selectedTemplateId: id,
      isEditing: false,
      editingContent: '',
    })),

  setEditing: (isEditing) => {
    const template = get().getSelectedTemplate();
    set({
      isEditing,
      editingContent: isEditing && template ? template.content : '',
    });
  },

  setEditingContent: (content) => set({ editingContent: content }),

  addTemplate: (templateData) => {
    const now = new Date().toISOString();
    const newTemplate: PromptTemplate = {
      ...templateData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
      versions: [],
    };
    set((state) => ({
      templates: [...state.templates, newTemplate],
      selectedTemplateId: newTemplate.id,
    }));
    return newTemplate;
  },

  updateTemplate: (id, updates) =>
    set((state) => ({
      templates: state.templates.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
      ),
    })),

  deleteTemplate: (id) =>
    set((state) => ({
      templates: state.templates.filter((t) => t.id !== id),
      selectedTemplateId: state.selectedTemplateId === id ? null : state.selectedTemplateId,
    })),

  duplicateTemplate: (id) => {
    const template = get().templates.find((t) => t.id === id);
    if (!template) return null;
    const now = new Date().toISOString();
    const newTemplate: PromptTemplate = {
      ...template,
      id: generateId(),
      title: `${template.title} (副本)`,
      isBuiltIn: false,
      createdAt: now,
      updatedAt: now,
      versions: [],
    };
    set((state) => ({
      templates: [...state.templates, newTemplate],
      selectedTemplateId: newTemplate.id,
    }));
    return newTemplate;
  },

  toggleFavorite: (id) =>
    set((state) => ({
      templates: state.templates.map((t) =>
        t.id === id ? { ...t, isFavorite: !t.isFavorite } : t
      ),
    })),

  toggleShared: (id) =>
    set((state) => ({
      templates: state.templates.map((t) =>
        t.id === id ? { ...t, isShared: !t.isShared } : t
      ),
    })),

  saveVersion: (id, message) => {
    const template = get().templates.find((t) => t.id === id);
    if (!template) return;
    const version: VersionEntry = {
      id: generateId(),
      templateId: id,
      content: template.content,
      message,
      createdAt: new Date().toISOString(),
      author: template.author,
    };
    set((state) => ({
      templates: state.templates.map((t) =>
        t.id === id ? { ...t, versions: [version, ...t.versions] } : t
      ),
    }));
  },

  restoreVersion: (templateId, versionId) => {
    const template = get().templates.find((t) => t.id === templateId);
    if (!template) return;
    const version = template.versions.find((v) => v.id === versionId);
    if (!version) return;
    get().saveVersion(templateId, '自动保存：恢复版本前');
    set((state) => ({
      templates: state.templates.map((t) =>
        t.id === templateId
          ? { ...t, content: version.content, updatedAt: new Date().toISOString() }
          : t
      ),
    }));
  },

  getFilteredTemplates: () => {
    const { templates, filters } = get();
    return templates.filter((t) => {
      if (filters.category !== 'all' && t.category !== filters.category) return false;
      if (filters.platform !== 'all' && t.platform !== filters.platform) return false;
      if (filters.showFavoritesOnly && !t.isFavorite) return false;
      if (filters.showSharedOnly && !t.isShared) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return (
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
        );
      }
      return true;
    });
  },

  getSelectedTemplate: () => {
    const { templates, selectedTemplateId } = get();
    return templates.find((t) => t.id === selectedTemplateId);
  },

  getTemplatesByCategory: (category) => {
    return get().templates.filter((t) => t.category === category);
  },

  importTemplates: (imported) => {
    const now = new Date().toISOString();
    const newTemplates = imported.map((t) => ({
      ...t,
      id: generateId(),
      isBuiltIn: false,
      createdAt: now,
      updatedAt: now,
      versions: [],
    }));
    set((state) => ({
      templates: [...state.templates, ...newTemplates],
    }));
  },
}));
