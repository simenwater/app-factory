"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Template } from "@/types";

/**
 * 创建项目弹窗组件
 * @param props - 弹窗属性
 * @param props.template - 选择的模板（可选）
 * @param props.onClose - 关闭回调
 * @param props.onCreated - 创建完成回调
 * @returns CreateProjectModal 组件
 */
export default function CreateProjectModal({
  template,
  onClose,
  onCreated,
}: {
  template?: Template;
  onClose: () => void;
  onCreated: () => void;
}) {
  const { createProject, subscription } = useStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const isOverLimit =
    subscription.plan === "free" &&
    subscription.projectCount >= subscription.projectLimit;

  /**
   * 处理表单提交
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isOverLimit) return;
    createProject(name.trim(), description.trim(), template?.id);
    onCreated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-md rounded-2xl border p-6 animate-fade-in"
        style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-color)" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1"
          style={{ color: "var(--text-muted)" }}
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-bold mb-1" style={{ color: "var(--text-primary)" }}>
          创建新项目
        </h2>
        {template && (
          <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
            使用模板：{template.name}
          </p>
        )}

        {isOverLimit && (
          <div
            className="p-3 rounded-lg mb-4 text-sm"
            style={{
              backgroundColor: "color-mix(in srgb, var(--warning) 10%, transparent)",
              color: "var(--warning)",
            }}
          >
            免费版最多支持 {subscription.projectLimit} 个项目，请升级到 Pro 方案
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--text-primary)" }}
            >
              项目名称 *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none border"
              style={{
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)",
              }}
              placeholder="例如：my-awesome-project"
              autoFocus
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--text-primary)" }}
            >
              项目描述
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none border resize-none"
              style={{
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)",
              }}
              placeholder="简要描述你的项目..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                color: "var(--text-primary)",
              }}
            >
              取消
            </button>
            <button
              type="submit"
              disabled={!name.trim() || isOverLimit}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50"
              style={{ backgroundColor: "var(--accent)" }}
            >
              创建项目
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
