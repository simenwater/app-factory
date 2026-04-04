/**
 * @fileoverview 求职申请追踪看板 — 拖拽式 Kanban 管理申请进度
 */
"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import type { ApplicationStatus, Application } from "@/types";
import EmptyState from "@/components/EmptyState";
import {
  Plus,
  X,
  LayoutDashboard,
  ExternalLink,
  Trash2,
  List,
  Columns,
} from "lucide-react";

/** 看板列配置 */
const COLUMNS: { id: ApplicationStatus; title: string; color: string }[] = [
  { id: "wishlist", title: "Wishlist", color: "border-t-gray-400" },
  { id: "applied", title: "Applied", color: "border-t-blue-500" },
  { id: "screening", title: "Screening", color: "border-t-purple-500" },
  { id: "interviewing", title: "Interviewing", color: "border-t-amber-500" },
  { id: "offer", title: "Offer", color: "border-t-green-500" },
  { id: "rejected", title: "Rejected", color: "border-t-red-500" },
];

/**
 * @returns 求职追踪看板页面
 */
export default function TrackerPage() {
  const { applications, addApplication, updateApplicationStatus, deleteApplication } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [viewMode, setViewMode] = useState<"board" | "list">("board");

  const [form, setForm] = useState({
    jobTitle: "",
    company: "",
    status: "wishlist" as ApplicationStatus,
    notes: "",
    jobUrl: "",
    salary: "",
  });

  /** 提交新申请 */
  const handleAdd = () => {
    if (!form.jobTitle.trim() || !form.company.trim()) return;
    addApplication({
      jobTitle: form.jobTitle,
      company: form.company,
      status: form.status,
      notes: form.notes,
      jobUrl: form.jobUrl,
      salary: form.salary,
      appliedAt: form.status !== "wishlist" ? new Date().toISOString() : undefined,
    });
    setForm({ jobTitle: "", company: "", status: "wishlist", notes: "", jobUrl: "", salary: "" });
    setShowAdd(false);
  };

  /** 获取某列的申请 */
  const getColumnApps = (status: ApplicationStatus): Application[] =>
    applications.filter((a) => a.status === status);

  /** 移动到下一个状态 */
  const moveNext = (app: Application) => {
    const idx = COLUMNS.findIndex((c) => c.id === app.status);
    if (idx < COLUMNS.length - 1) {
      updateApplicationStatus(app.id, COLUMNS[idx + 1].id);
    }
  };

  /** 移动到上一个状态 */
  const movePrev = (app: Application) => {
    const idx = COLUMNS.findIndex((c) => c.id === app.status);
    if (idx > 0) {
      updateApplicationStatus(app.id, COLUMNS[idx - 1].id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Application Tracker</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track and manage your job applications
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button
              onClick={() => setViewMode("board")}
              className={`p-2 text-sm ${viewMode === "board" ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
            >
              <Columns className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 text-sm ${viewMode === "list" ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {/* Add modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">New Application</h2>
              <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={form.jobTitle}
                onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                placeholder="Job Title *"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="Company *"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as ApplicationStatus })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {COLUMNS.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
              <input
                type="text"
                value={form.jobUrl}
                onChange={(e) => setForm({ ...form, jobUrl: e.target.value })}
                placeholder="Job URL (optional)"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: e.target.value })}
                placeholder="Salary Range (optional)"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Notes (optional)"
                rows={3}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm resize-none outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowAdd(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={!form.jobTitle.trim() || !form.company.trim()}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white text-sm font-medium"
              >
                Add Application
              </button>
            </div>
          </div>
        </div>
      )}

      {applications.length === 0 ? (
        <EmptyState
          icon={LayoutDashboard}
          title="No applications yet"
          description="Start tracking your job applications by clicking the Add button"
          action={
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 px-5 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Application
            </button>
          }
        />
      ) : viewMode === "board" ? (
        /* Board / Kanban view */
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((col) => {
            const apps = getColumnApps(col.id);
            return (
              <div key={col.id} className="min-w-[260px] flex-1">
                <div className={`rounded-xl border border-gray-200 dark:border-gray-800 border-t-4 ${col.color} bg-gray-50 dark:bg-gray-900/50 p-3`}>
                  <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{col.title}</h3>
                    <span className="text-xs text-gray-400 bg-gray-200 dark:bg-gray-800 rounded-full px-2 py-0.5">
                      {apps.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {apps.map((app) => (
                      <div
                        key={app.id}
                        className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-gray-900 dark:text-white truncate">
                              {app.jobTitle}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{app.company}</div>
                          </div>
                          <div className="flex items-center gap-1 ml-2">
                            {app.jobUrl && (
                              <a
                                href={app.jobUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-indigo-500"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                            <button
                              onClick={() => deleteApplication(app.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {app.salary && (
                          <div className="text-xs text-gray-400 mt-1">{app.salary}</div>
                        )}

                        {app.matchScore && (
                          <div className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
                            Match: {app.matchScore}%
                          </div>
                        )}

                        <div className="flex items-center gap-1.5 mt-2">
                          <button
                            onClick={() => movePrev(app)}
                            disabled={COLUMNS.findIndex((c) => c.id === app.status) === 0}
                            className="text-xs text-gray-400 hover:text-gray-600 disabled:opacity-30 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700"
                          >
                            ←
                          </button>
                          <button
                            onClick={() => moveNext(app)}
                            disabled={COLUMNS.findIndex((c) => c.id === app.status) === COLUMNS.length - 1}
                            className="text-xs text-gray-400 hover:text-gray-600 disabled:opacity-30 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700"
                          >
                            →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List view */
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Position</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Company</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Updated</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 dark:text-white">{app.jobTitle}</div>
                    {app.salary && <div className="text-xs text-gray-400">{app.salary}</div>}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{app.company}</td>
                  <td className="px-4 py-3">
                    <select
                      value={app.status}
                      onChange={(e) => updateApplicationStatus(app.id, e.target.value as ApplicationStatus)}
                      className="text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent px-2 py-1 outline-none"
                    >
                      {COLUMNS.map((c) => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                    {new Date(app.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => deleteApplication(app.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
