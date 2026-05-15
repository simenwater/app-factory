"use client";

import { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import TemplateCard from "@/components/TemplateCard";
import MarkdownEditor from "@/components/MarkdownEditor";
import ExportImport from "@/components/ExportImport";
import SyncPanel from "@/components/SyncPanel";
import PricingCards from "@/components/PricingCard";
import CreateProjectModal from "@/components/CreateProjectModal";
import { useStore } from "@/store/useStore";
import { filterTemplatesByCategory, searchTemplates, getCategoryLabel } from "@/lib/templates";
import { Template, TemplateCategory } from "@/types";
import { Search, Plus, ChevronLeft, Trash2, FileCode2, Sparkles } from "lucide-react";

/**
 * 首页 - 应用主入口
 * @returns 主页面组件
 */
export default function Home() {
  const {
    projects,
    templates,
    activeProjectId,
    selectedCategory,
    searchQuery,
    setActiveProject,
    setSelectedCategory,
    setSearchQuery,
    updateProject,
    deleteProject,
  } = useStore();

  const [activeTab, setActiveTab] = useState("templates");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | undefined>();
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("contextkit_projects");
    if (stored) {
      try {
        const projects = JSON.parse(stored);
        useStore.getState().importProjects(projects);
      } catch { /* ignored */ }
    }
  }, []);

  const activeProject = useMemo(
    () => projects.find((p) => p.id === activeProjectId),
    [projects, activeProjectId]
  );

  const filteredTemplates = useMemo(() => {
    let result = filterTemplatesByCategory(templates, selectedCategory);
    if (searchQuery) {
      result = searchTemplates(result, searchQuery);
    }
    return result;
  }, [templates, selectedCategory, searchQuery]);

  const categories: (TemplateCategory | "all")[] = [
    "all", "general", "frontend", "backend", "fullstack", "mobile", "devops", "data",
  ];

  /**
   * 使用模板创建项目
   */
  const handleUseTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setShowCreateModal(true);
  };

  /**
   * 项目创建完成后跳转到编辑器
   */
  const handleProjectCreated = () => {
    setShowCreateModal(false);
    setSelectedTemplate(undefined);
    setActiveTab("editor");
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <FileCode2 size={48} style={{ color: "var(--accent)" }} className="mx-auto mb-4" />
          <p style={{ color: "var(--text-muted)" }}>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* 模板库 */}
        {activeTab === "templates" && (
          <div className="animate-fade-in">
            {previewTemplate ? (
              <div>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="flex items-center gap-1 text-sm mb-4 transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <ChevronLeft size={16} />
                  返回模板库
                </button>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                      {previewTemplate.name}
                    </h2>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      {previewTemplate.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleUseTemplate(previewTemplate)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                    style={{ backgroundColor: "var(--accent)" }}
                  >
                    使用此模板
                  </button>
                </div>
                <MarkdownEditor
                  content={previewTemplate.content}
                  onChange={() => {}}
                  readOnly
                />
              </div>
            ) : (
              <>
                {/* Hero 区域 */}
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm mb-4" style={{ backgroundColor: "var(--accent-light)", color: "var(--accent)" }}>
                    <Sparkles size={14} />
                    标准化你的 AI 工作流
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
                    AGENTS.md 模板库
                  </h1>
                  <p className="text-base max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
                    从精心设计的模板开始，快速生成标准化的 AI 代理配置文件，让 AI 更懂你的项目上下文。
                  </p>
                </div>

                {/* 搜索和过滤 */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ color: "var(--text-muted)" }}
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none border"
                      style={{
                        backgroundColor: "var(--bg-secondary)",
                        color: "var(--text-primary)",
                        borderColor: "var(--border-color)",
                      }}
                      placeholder="搜索模板..."
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                      style={{
                        backgroundColor: selectedCategory === cat ? "var(--accent-light)" : "var(--bg-tertiary)",
                        color: selectedCategory === cat ? "var(--accent)" : "var(--text-secondary)",
                      }}
                    >
                      {getCategoryLabel(cat)}
                    </button>
                  ))}
                </div>

                {/* 模板网格 */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredTemplates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onUse={handleUseTemplate}
                      onPreview={setPreviewTemplate}
                    />
                  ))}
                </div>

                {filteredTemplates.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-base" style={{ color: "var(--text-muted)" }}>
                      没有找到匹配的模板
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* 编辑器 */}
        {activeTab === "editor" && (
          <div className="animate-fade-in">
            {activeProject ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setActiveProject(null)}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: "var(--text-secondary)", backgroundColor: "var(--bg-tertiary)" }}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <div>
                      <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                        {activeProject.name}
                      </h2>
                      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                        {activeProject.description || "AGENTS.md 编辑器"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      deleteProject(activeProject.id);
                      setActiveProject(null);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors"
                    style={{ color: "var(--danger)", backgroundColor: "color-mix(in srgb, var(--danger) 10%, transparent)" }}
                  >
                    <Trash2 size={14} />
                    删除
                  </button>
                </div>
                <MarkdownEditor
                  content={activeProject.agentsContent}
                  onChange={(content) =>
                    updateProject(activeProject.id, { agentsContent: content })
                  }
                />
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                    我的项目
                  </h2>
                  <button
                    onClick={() => {
                      setSelectedTemplate(undefined);
                      setShowCreateModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
                    style={{ backgroundColor: "var(--accent)" }}
                  >
                    <Plus size={16} />
                    新建项目
                  </button>
                </div>

                {projects.length === 0 ? (
                  <div className="text-center py-20">
                    <FileCode2
                      size={48}
                      className="mx-auto mb-4"
                      style={{ color: "var(--text-muted)" }}
                    />
                    <p className="text-lg font-medium mb-2" style={{ color: "var(--text-primary)" }}>
                      还没有项目
                    </p>
                    <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
                      从模板库选择一个模板开始，或创建空白项目
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => setActiveTab("templates")}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                        style={{ backgroundColor: "var(--accent)" }}
                      >
                        浏览模板库
                      </button>
                      <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-4 py-2 rounded-lg text-sm font-medium"
                        style={{
                          backgroundColor: "var(--bg-tertiary)",
                          color: "var(--text-primary)",
                        }}
                      >
                        创建空白项目
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        onClick={() => setActiveProject(project.id)}
                        className="rounded-xl border p-5 cursor-pointer transition-all hover:shadow-md"
                        style={{
                          backgroundColor: "var(--bg-card)",
                          borderColor: "var(--border-color)",
                        }}
                      >
                        <h3 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                          {project.name}
                        </h3>
                        <p className="text-sm mb-3 line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                          {project.description || "无描述"}
                        </p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                          更新于 {new Date(project.updatedAt).toLocaleDateString("zh-CN")}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 导出/导入区域 */}
            {!activeProject && projects.length > 0 && (
              <div className="mt-10">
                <h2 className="text-xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
                  导出 / 导入
                </h2>
                <ExportImport />
              </div>
            )}
          </div>
        )}

        {/* 同步管理 */}
        {activeTab === "sync" && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
              同步管理
            </h2>
            <SyncPanel />
          </div>
        )}

        {/* 定价 */}
        {activeTab === "pricing" && (
          <div className="animate-fade-in py-4">
            <PricingCards />
          </div>
        )}
      </main>

      {/* 创建项目弹窗 */}
      {showCreateModal && (
        <CreateProjectModal
          template={selectedTemplate}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedTemplate(undefined);
          }}
          onCreated={handleProjectCreated}
        />
      )}

      {/* 页脚 */}
      <footer
        className="border-t mt-16 py-8"
        style={{ borderColor: "var(--border-color)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <FileCode2 size={18} style={{ color: "var(--accent)" }} />
              <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                ContextKit
              </span>
            </div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              &copy; {new Date().getFullYear()} ContextKit. 让 AI 更懂你的项目上下文。
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
