/**
 * @fileoverview 设置页面 — 深色模式切换、数据管理和关于信息
 */
"use client";

import { useStore } from "@/store/useStore";
import {
  Moon,
  Sun,
  Trash2,
  Download,
  Info,
  Shield,
} from "lucide-react";
import { useState } from "react";

/**
 * @returns 设置页面
 */
export default function SettingsPage() {
  const { darkMode, toggleDarkMode, resumes, applications, matchResults, quota } = useStore();
  const [showConfirm, setShowConfirm] = useState(false);

  /** 导出所有数据 */
  const handleExport = () => {
    const data = {
      resumes,
      applications,
      matchResults,
      quota,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `careerpilot-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /** 清除所有数据 */
  const handleClearData = () => {
    localStorage.removeItem("careerpilot-storage");
    window.location.reload();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Customize your CareerPilot experience
        </p>
      </div>

      {/* Appearance */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Appearance</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {darkMode ? <Moon className="w-5 h-5 text-indigo-500" /> : <Sun className="w-5 h-5 text-amber-500" />}
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {darkMode ? "Dark theme enabled" : "Light theme enabled"}
              </div>
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              darkMode ? "bg-indigo-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                darkMode ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Data overview */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Your Data</h2>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{resumes.length}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Resumes</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{applications.length}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Applications</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{matchResults.length}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Matches</div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleExport}
            className="w-full flex items-center gap-2 py-2.5 px-4 rounded-xl border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Data as JSON
          </button>

          <button
            onClick={() => setShowConfirm(true)}
            className="w-full flex items-center gap-2 py-2.5 px-4 rounded-xl border border-red-200 dark:border-red-900 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear All Data
          </button>
        </div>
      </div>

      {/* About */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">About</h2>
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 text-indigo-500" />
            <p>
              CareerPilot AI is an AI-powered resume optimization and job application
              tracking tool designed for job seekers.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 mt-0.5 text-green-500" />
            <p>
              Your data is stored locally in your browser. We do not collect or store
              your personal information on our servers.
            </p>
          </div>
        </div>
        <div className="mt-4 text-xs text-gray-400 dark:text-gray-500">
          Version 0.1.0 · Built with Next.js, TypeScript & Tailwind CSS
        </div>
      </div>

      {/* Confirm dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <Trash2 className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Clear All Data?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              This will permanently delete all your resumes, applications, and match results.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium"
              >
                Delete Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
