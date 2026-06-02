"use client";

import { Search, MessageSquareOff, FileText } from "lucide-react";
import { useAppStore, ActiveView } from "@/store";

const NAV_ITEMS: { view: ActiveView; label: string; icon: typeof Search }[] = [
  { view: "analyze", label: "Analyze Message", icon: Search },
  { view: "reject", label: "Generate Rejection", icon: MessageSquareOff },
  { view: "quote", label: "Build Quote", icon: FileText },
];

/**
 * @description 主导航组件
 */
export function Navigation() {
  const { activeView, setActiveView } = useAppStore();

  return (
    <nav className="border-b border-(--color-border) bg-(--color-surface)">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex gap-1">
          {NAV_ITEMS.map(({ view, label, icon: Icon }) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeView === view
                  ? "border-(--color-primary) text-(--color-primary)"
                  : "border-transparent text-(--color-muted) hover:text-(--color-foreground)"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
