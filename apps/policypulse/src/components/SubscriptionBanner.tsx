"use client";

import Link from "next/link";
import { Sparkles, X } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useState } from "react";

/**
 * @component SubscriptionBanner
 * 免费用户升级提示横幅
 */
export function SubscriptionBanner() {
  const tier = useStore((s) => s.settings.subscriptionTier);
  const [dismissed, setDismissed] = useState(false);

  if (tier === "pro" || dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 flex items-center justify-between text-white mb-6">
      <div className="flex items-center gap-3">
        <Sparkles className="w-5 h-5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold">
            升级专业版，解锁完整 AI 深度解读
          </p>
          <p className="text-xs opacity-80">
            实时预警 · 无限行业 · 深度分析 — $14.99/月
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/pricing"
          className="px-4 py-1.5 bg-white text-blue-600 text-sm font-semibold rounded-lg hover:bg-blue-50 transition-colors"
        >
          查看方案
        </Link>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 hover:bg-white/20 rounded transition-colors"
          aria-label="关闭"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
