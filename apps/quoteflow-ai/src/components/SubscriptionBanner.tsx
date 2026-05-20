"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useStore } from "@/store/useStore";

/**
 * @description 免费版用量限制提示横幅
 */
export function SubscriptionBanner() {
  const isLimitReached = useStore((s) => s.isFreeLimitReached());
  const subscription = useStore((s) => s.settings.subscription);

  if (subscription === "pro" || !isLimitReached) return null;

  return (
    <div className="mx-4 mb-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white shadow-lg">
      <div className="flex items-start gap-3">
        <Sparkles size={20} className="mt-0.5 shrink-0" />
        <div className="flex-1">
          <p className="font-semibold">Free plan limit reached</p>
          <p className="mt-0.5 text-sm text-white/80">
            Upgrade to Pro for unlimited quotes, custom templates, and priority
            support.
          </p>
          <Link
            href="/pricing"
            className="mt-2 inline-block rounded-lg bg-white px-4 py-1.5 text-sm font-semibold text-indigo-600 transition-colors hover:bg-white/90"
          >
            Upgrade to Pro — $9.90/mo
          </Link>
        </div>
      </div>
    </div>
  );
}
