"use client";

import {
  Combine,
  Scissors,
  PenTool,
  ScanText,
  Shield,
  Zap,
  Eye,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import Header from "@/components/Header";
import MergePanel from "@/components/MergePanel";
import SplitPanel from "@/components/SplitPanel";
import SignPanel from "@/components/SignPanel";
import OCRPanel from "@/components/OCRPanel";
import PricingSection from "@/components/PricingSection";
import type { ToolTab } from "@/types";

/**
 * @description PrivPDF 首页，包含工具标签页、功能面板和定价方案
 */

const tabs: { id: ToolTab; label: string; icon: React.ReactNode }[] = [
  { id: "merge", label: "合并", icon: <Combine size={18} /> },
  { id: "split", label: "分割", icon: <Scissors size={18} /> },
  { id: "sign", label: "签名", icon: <PenTool size={18} /> },
  { id: "ocr", label: "OCR", icon: <ScanText size={18} /> },
];

const features = [
  {
    icon: <Shield size={24} />,
    title: "隐私优先",
    desc: "所有文件处理完全在浏览器本地进行，文件永远不会上传到服务器。",
  },
  {
    icon: <Zap size={24} />,
    title: "快速高效",
    desc: "基于 WebAssembly 技术，本地处理速度媲美原生应用。",
  },
  {
    icon: <Eye size={24} />,
    title: "零追踪",
    desc: "无需注册账号，不收集任何用户数据，不使用追踪 Cookie。",
  },
];

export default function HomePage() {
  const activeTab = useStore((s) => s.activeTab);
  const setActiveTab = useStore((s) => s.setActiveTab);
  const clearFiles = useStore((s) => s.clearFiles);

  const handleTabChange = (tab: ToolTab) => {
    clearFiles();
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Hero */}
        <section className="mb-10 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">
            隐私优先的
            <span style={{ color: "var(--color-primary)" }}> PDF 工具</span>
          </h1>
          <p
            className="mx-auto mt-3 max-w-xl text-base"
            style={{ color: "var(--color-text-secondary)" }}
          >
            完全在浏览器本地运行，你的文件永远不会离开设备。合并、分割、签名、OCR，一站式搞定。
          </p>
        </section>

        {/* Tool Tabs */}
        <section className="mb-8">
          <div
            className="flex overflow-x-auto rounded-xl p-1"
            style={{ backgroundColor: "var(--color-bg-secondary)" }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all"
                style={{
                  backgroundColor:
                    activeTab === tab.id
                      ? "var(--color-bg)"
                      : "transparent",
                  color:
                    activeTab === tab.id
                      ? "var(--color-primary)"
                      : "var(--color-text-secondary)",
                  boxShadow:
                    activeTab === tab.id
                      ? "0 1px 3px rgba(0,0,0,0.1)"
                      : "none",
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* Active Panel */}
        <section
          className="rounded-xl border p-6"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-bg)",
          }}
        >
          {activeTab === "merge" && <MergePanel />}
          {activeTab === "split" && <SplitPanel />}
          {activeTab === "sign" && <SignPanel />}
          {activeTab === "ocr" && <OCRPanel />}
        </section>

        {/* Features */}
        <section className="mt-16 mb-16">
          <h2 className="mb-8 text-center text-2xl font-bold">
            为什么选择 PrivPDF？
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border p-6 text-center"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-bg-secondary)",
                }}
              >
                <div
                  className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: "var(--color-primary-light)",
                    color: "var(--color-primary)",
                  }}
                >
                  {f.icon}
                </div>
                <h3 className="text-base font-semibold">{f.title}</h3>
                <p
                  className="mt-1.5 text-sm"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="mb-16">
          <PricingSection />
        </section>

        {/* Footer */}
        <footer
          className="border-t py-8 text-center text-sm"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text-muted)",
          }}
        >
          <p>
            PrivPDF — 隐私优先的本地 PDF 工具 · 所有文件处理完全在你的设备上进行
          </p>
        </footer>
      </main>
    </div>
  );
}
