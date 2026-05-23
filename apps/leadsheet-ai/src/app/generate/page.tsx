"use client";

/**
 * @fileoverview AI 生成乐谱页面
 */

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, Lightbulb } from "lucide-react";
import { useStore } from "@/store/useStore";
import { generateLeadSheet, suggestDefaults } from "@/lib/leadSheetGenerator";
import { saveSheet } from "@/lib/db";
import type { MusicStyle, GenerateRequest } from "@/types";

const STYLE_OPTIONS: { value: MusicStyle; label: string }[] = [
  { value: "jazz-swing", label: "🎷 Swing" },
  { value: "jazz-bossa", label: "🌴 Bossa Nova" },
  { value: "jazz-ballad", label: "🌙 Ballad" },
  { value: "jazz-latin", label: "💃 Latin" },
  { value: "jazz-bebop", label: "🎺 Bebop" },
  { value: "jazz-cool", label: "❄️ Cool Jazz" },
  { value: "blues", label: "🎸 Blues" },
  { value: "pop", label: "🎤 Pop" },
  { value: "folk", label: "🪕 Folk" },
];

const KEY_OPTIONS = [
  "C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B",
];

const COMPLEXITY_OPTIONS = [
  { value: "simple" as const, label: "简单", desc: "基础和弦进行" },
  { value: "moderate" as const, label: "中等", desc: "丰富的替代和弦" },
  { value: "complex" as const, label: "复杂", desc: "高级和声进行" },
];

/**
 * @description AI 生成乐谱页面
 */
export default function GeneratePage() {
  const router = useRouter();
  const settings = useStore((s) => s.settings);
  const addSheet = useStore((s) => s.addSheet);
  const incrementGenerations = useStore((s) => s.incrementGenerations);
  const canGenerate = useStore((s) => s.canGenerate);

  const [isGenerating, setIsGenerating] = useState(false);
  const [form, setForm] = useState<GenerateRequest>({
    title: "",
    style: settings.defaultStyle,
    key: settings.defaultKey,
    timeSignature: settings.defaultTimeSignature,
    tempo: settings.defaultTempo,
    measures: 32,
    complexity: "moderate",
    description: "",
  });

  const handleTitleBlur = useCallback(() => {
    if (form.title.trim()) {
      const defaults = suggestDefaults(form.title);
      setForm((prev) => ({ ...prev, ...defaults, title: prev.title }));
    }
  }, [form.title]);

  const handleGenerate = useCallback(async () => {
    if (!canGenerate()) {
      alert("已达到本月免费生成次数上限，请升级到 Pro 方案。");
      return;
    }

    setIsGenerating(true);

    try {
      await new Promise((r) => setTimeout(r, 1500));

      const sheet = generateLeadSheet(form);

      addSheet(sheet);
      incrementGenerations();

      try {
        await saveSheet(sheet);
      } catch {
        // IndexedDB may not be available in some environments
      }

      router.push(`/player/${sheet.id}`);
    } catch (err) {
      console.error("Generation failed:", err);
      alert("生成失败，请重试。");
    } finally {
      setIsGenerating(false);
    }
  }, [form, canGenerate, addSheet, incrementGenerations, router]);

  return (
    <div className="px-4 pt-6">
      <h1 className="mb-1 text-2xl font-bold">AI 生成乐谱</h1>
      <p className="mb-6 text-sm text-text-muted dark:text-text-muted-dark">
        输入曲目信息，AI 将自动生成和弦进行与旋律骨架
      </p>

      <div className="space-y-5">
        {/* Title */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">曲目名称</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            onBlur={handleTitleBlur}
            placeholder="例如：Autumn Leaves"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm placeholder:text-text-muted dark:border-border-dark dark:bg-surface-dark dark:placeholder:text-text-muted-dark"
          />
          <p className="mt-1 flex items-center gap-1 text-xs text-text-muted dark:text-text-muted-dark">
            <Lightbulb size={12} />
            输入曲名后 AI 会自动推荐参数
          </p>
        </div>

        {/* Style */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">音乐风格</label>
          <div className="grid grid-cols-3 gap-2">
            {STYLE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setForm({ ...form, style: opt.value })}
                className={`rounded-xl border px-3 py-2.5 text-xs font-medium transition-all ${
                  form.style === opt.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50 dark:border-border-dark"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Key & Time Signature */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">调号</label>
            <select
              value={form.key}
              onChange={(e) => setForm({ ...form, key: e.target.value })}
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm dark:border-border-dark dark:bg-surface-dark"
            >
              {KEY_OPTIONS.map((k) => (
                <option key={k} value={k}>{k} Major</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">拍号</label>
            <select
              value={`${form.timeSignature[0]}/${form.timeSignature[1]}`}
              onChange={(e) => {
                const [n, d] = e.target.value.split("/").map(Number);
                setForm({ ...form, timeSignature: [n, d] });
              }}
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm dark:border-border-dark dark:bg-surface-dark"
            >
              <option value="4/4">4/4</option>
              <option value="3/4">3/4</option>
              <option value="6/8">6/8</option>
              <option value="5/4">5/4</option>
            </select>
          </div>
        </div>

        {/* Tempo & Measures */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              速度 <span className="text-text-muted dark:text-text-muted-dark">{form.tempo} BPM</span>
            </label>
            <input
              type="range"
              min={40}
              max={300}
              value={form.tempo}
              onChange={(e) => setForm({ ...form, tempo: Number(e.target.value) })}
              className="w-full accent-primary"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">小节数</label>
            <select
              value={form.measures}
              onChange={(e) => setForm({ ...form, measures: Number(e.target.value) })}
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm dark:border-border-dark dark:bg-surface-dark"
            >
              {[8, 12, 16, 24, 32, 48, 64].map((n) => (
                <option key={n} value={n}>{n} 小节</option>
              ))}
            </select>
          </div>
        </div>

        {/* Complexity */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">和声复杂度</label>
          <div className="grid grid-cols-3 gap-2">
            {COMPLEXITY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setForm({ ...form, complexity: opt.value })}
                className={`rounded-xl border px-3 py-3 text-center transition-all ${
                  form.complexity === opt.value
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50 dark:border-border-dark"
                }`}
              >
                <div className={`text-sm font-semibold ${form.complexity === opt.value ? "text-primary" : ""}`}>
                  {opt.label}
                </div>
                <div className="text-xs text-text-muted dark:text-text-muted-dark">
                  {opt.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Description (optional) */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            补充描述 <span className="text-text-muted dark:text-text-muted-dark">(可选)</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="例如：类似 Autumn Leaves 的和弦走向，加入一些替代和弦..."
            rows={3}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm placeholder:text-text-muted dark:border-border-dark dark:bg-surface-dark dark:placeholder:text-text-muted-dark"
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !form.title.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              AI 正在生成...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              生成乐谱
            </>
          )}
        </button>
      </div>
    </div>
  );
}
