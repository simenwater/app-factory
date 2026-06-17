"use client";

/**
 * @fileoverview RateGuard 主页面
 */

import { useState } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { MessageInput } from "@/components/MessageInput";
import { AnalysisResult } from "@/components/AnalysisResult";
import { TemplateCards } from "@/components/TemplateCards";
import { HistoryList } from "@/components/HistoryList";
import { SettingsPanel } from "@/components/SettingsPanel";
import { PricingPage } from "@/components/PricingPage";
import { SubscriptionBadge } from "@/components/SubscriptionBadge";

/**
 * HomePage - 应用主入口页面
 */
export default function HomePage() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pricingOpen, setPricingOpen] = useState(false);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Header onOpenSettings={() => setSettingsOpen(true)} />

        <main className="mx-auto max-w-3xl space-y-6 px-4 py-8">
          <SubscriptionBadge onUpgrade={() => setPricingOpen(true)} />
          <MessageInput />
          <AnalysisResult />
          <TemplateCards />
          <HistoryList />
        </main>

        <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
        {pricingOpen && <PricingPage onClose={() => setPricingOpen(false)} />}
      </div>
    </ThemeProvider>
  );
}
