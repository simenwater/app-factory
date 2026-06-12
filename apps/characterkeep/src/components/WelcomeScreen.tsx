"use client";

import { useState } from "react";
import { useAppStore } from "@/store";
import { BookOpen } from "lucide-react";

/**
 * 欢迎页面 — 创建新项目入口
 */
export function WelcomeScreen() {
  const { createProject, darkMode, toggleDarkMode } = useAppStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  /** 提交创建项目 */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createProject(name.trim(), description.trim() || undefined);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleDarkMode}
          className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          style={{
            backgroundColor: "var(--bg-tertiary)",
            color: "var(--text-secondary)",
          }}
        >
          {darkMode ? "☀️ 浅色" : "🌙 深色"}
        </button>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ backgroundColor: "var(--accent)", color: "white" }}
          >
            <BookOpen className="w-8 h-8" />
          </div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            CharacterKeep
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            AI 角色一致性守护 — 让每个角色都始终如一
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-6 space-y-4"
          style={{
            backgroundColor: "var(--bg-secondary)",
            boxShadow: "var(--card-shadow)",
            border: "1px solid var(--border)",
          }}
        >
          <h2
            className="text-lg font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            创建新项目
          </h2>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--text-secondary)" }}
            >
              小说名称 *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：星际迷途"
              className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-colors"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
              }}
              required
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--text-secondary)" }}
            >
              简介（可选）
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="简要描述你的小说…"
              rows={3}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none transition-colors"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
              }}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: "var(--accent)" }}
          >
            开始创作
          </button>
        </form>

        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          {[
            { icon: "🎭", label: "角色追踪" },
            { icon: "🔍", label: "一致性检查" },
            { icon: "⚡", label: "冲突预警" },
          ].map((item) => (
            <div
              key={item.label}
              className="p-3 rounded-xl"
              style={{
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="text-2xl mb-1">{item.icon}</div>
              <div
                className="text-xs font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
