"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { MessageAnalyzer } from "@/components/MessageAnalyzer";
import { RejectionGenerator } from "@/components/RejectionGenerator";
import { QuoteBuilder } from "@/components/QuoteBuilder";
import { PaywallModal } from "@/components/PaywallModal";

/**
 * @description 主页面组件
 */
export default function Home() {
  const { activeView, darkMode, subscription, canUseFeature } = useAppStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const showPaywall = subscription.plan === "free" && subscription.freeUsesRemaining <= 0;

  return (
    <div className="min-h-screen bg-(--color-background) text-(--color-foreground) transition-colors duration-300">
      <Header />
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-8">
        {activeView === "analyze" && <MessageAnalyzer />}
        {activeView === "reject" && <RejectionGenerator />}
        {activeView === "quote" && <QuoteBuilder />}
      </main>
      {showPaywall && <PaywallModal />}
    </div>
  );
}
