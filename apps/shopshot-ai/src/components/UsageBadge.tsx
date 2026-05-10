"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import { useStore } from "@/store/useStore";
import { getImageLimit } from "@/lib/utils";

/**
 * @description 用量展示徽章
 */
export function UsageBadge() {
  const settings = useStore((s) => s.settings);
  const remaining = useStore((s) => s.getRemainingQuota());
  const limit = getImageLimit(settings.subscription);

  const isUnlimited = limit === -1;
  const isLow = !isUnlimited && remaining <= 1;

  return (
    <Link
      href="/pricing"
      className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        isLow
          ? "bg-danger/10 text-danger"
          : "bg-primary/10 text-primary"
      }`}
    >
      <Zap size={12} />
      {isUnlimited
        ? "Unlimited"
        : `${remaining}/${limit} left`}
    </Link>
  );
}
