'use client';

/**
 * @fileoverview 项目管理页面
 */

import { useState } from 'react';
import {
  Plus,
  ExternalLink,
  Users,
  MessageSquare,
  X,
  Globe,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { formatRelativeTime } from '@/lib/utils';
import Avatar from '@/components/Avatar';

export default function ProjectsPage() {
  const { projects, addProject, currentUser } = useStore();
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', url: '', description: '' });

  /**
   * @description 创建新项目
   */
  const handleCreateProject = () => {
    if (!newProject.name || !newProject.url) return;
    addProject({
      id: `p-${Date.now()}`,
      name: newProject.name,
      url: newProject.url,
      description: newProject.description,
      members: [currentUser],
      commentCount: 0,
      openCommentCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setNewProject({ name: '', url: '', description: '' });
    setShowNewProject(false);
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">项目管理</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            管理需要评论协作的网站和应用
          </p>
        </div>
        <button
          onClick={() => setShowNewProject(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          新建项目
        </button>
      </div>

      {/* 新建项目表单 */}
      {showNewProject && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">新建项目</h3>
            <button onClick={() => setShowNewProject(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">项目名称</label>
              <input
                type="text"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                placeholder="例如：Marketing Website"
                className="mt-1 w-full px-3 py-2 text-sm bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">网站 URL</label>
              <input
                type="url"
                value={newProject.url}
                onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
                placeholder="https://example.com"
                className="mt-1 w-full px-3 py-2 text-sm bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">描述（可选）</label>
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                placeholder="简要描述这个项目..."
                rows={2}
                className="mt-1 w-full px-3 py-2 text-sm bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowNewProject(false)}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                取消
              </button>
              <button
                onClick={handleCreateProject}
                disabled={!newProject.name || !newProject.url}
                className="px-4 py-2 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg disabled:opacity-50"
              >
                创建项目
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 项目列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{project.name}</h3>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1"
                  >
                    {project.url} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {project.description && (
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {project.description}
              </p>
            )}

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  {project.commentCount} 评论
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {project.members.length} 成员
                </span>
              </div>
              <div className="flex -space-x-2">
                {project.members.slice(0, 3).map((member) => (
                  <Avatar key={member.id} user={member} size="sm" />
                ))}
                {project.members.length > 3 && (
                  <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs">
                    +{project.members.length - 3}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
              <span>更新于 {formatRelativeTime(project.updatedAt)}</span>
              <span className="text-orange-500 dark:text-orange-400 font-medium">
                {project.openCommentCount} 待处理
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
