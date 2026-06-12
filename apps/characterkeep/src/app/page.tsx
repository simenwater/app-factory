"use client";

import { useAppStore } from "@/store";
import { Sidebar } from "@/components/Sidebar";
import { CharacterPanel } from "@/components/CharacterPanel";
import { EventPanel } from "@/components/EventPanel";
import { ConsistencyPanel } from "@/components/ConsistencyPanel";
import { ConflictPanel } from "@/components/ConflictPanel";
import { SettingsPanel } from "@/components/SettingsPanel";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { useEffect } from "react";

/**
 * 应用主页面组件
 */
export default function Home() {
  const { currentProject, activeTab, darkMode } = useAppStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  if (!currentProject) {
    return <WelcomeScreen />;
  }

  return (
    <div className="flex h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <Sidebar />
      <main className="flex-1 overflow-auto" style={{ backgroundColor: "var(--bg-secondary)" }}>
        {activeTab === "characters" && <CharacterPanel />}
        {activeTab === "events" && <EventPanel />}
        {activeTab === "consistency" && <ConsistencyPanel />}
        {activeTab === "conflicts" && <ConflictPanel />}
        {activeTab === "settings" && <SettingsPanel />}
      </main>
    </div>
  );
}
