"use client";

import Link from "next/link";
import {
  Camera,
  Images,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Download,
  Zap,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { UsageBadge } from "@/components/UsageBadge";

/**
 * @description 首页 — 产品落地页 + 仪表盘
 */
export default function HomePage() {
  const stats = useStore((s) => s.stats);
  const jobs = useStore((s) => s.jobs);
  const settings = useStore((s) => s.settings);

  const recentJobs = jobs.slice(0, 3);
  const hasHistory = jobs.length > 0;

  return (
    <div className="px-4 pt-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              ShopShot
            </span>{" "}
            AI
          </h1>
          <p className="text-sm text-text-muted dark:text-text-muted-dark">
            AI product images in seconds
          </p>
        </div>
        <UsageBadge />
      </div>

      {/* Hero CTA */}
      <Link
        href="/generate"
        className="mb-8 flex items-center justify-between rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-6 shadow-lg transition-shadow hover:shadow-xl"
      >
        <div>
          <h2 className="mb-1 text-lg font-bold text-white">
            Generate Product Images
          </h2>
          <p className="text-sm text-white/80">
            Upload a photo, pick scenes & angles
          </p>
        </div>
        <div className="rounded-full bg-white/20 p-3">
          <Camera size={24} className="text-white" />
        </div>
      </Link>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-3 gap-3">
        {[
          {
            label: "Generated",
            value: stats.totalGenerated,
            icon: Sparkles,
            color: "text-primary",
            bg: "bg-primary/10",
          },
          {
            label: "Exported",
            value: stats.totalExported,
            icon: Download,
            color: "text-success",
            bg: "bg-success/10",
          },
          {
            label: "Projects",
            value: jobs.length,
            icon: TrendingUp,
            color: "text-warning",
            bg: "bg-warning/10",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`rounded-2xl ${stat.bg} p-4 transition-shadow hover:shadow-md`}
          >
            <stat.icon size={18} className={`mb-2 ${stat.color}`} />
            <p className="text-xl font-bold text-text dark:text-text-dark">
              {stat.value}
            </p>
            <p className="text-xs text-text-muted dark:text-text-muted-dark">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/generate"
            className="flex items-center gap-3 rounded-xl bg-surface p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-surface-dark"
          >
            <div className="rounded-lg bg-primary/10 p-2">
              <Camera size={18} className="text-primary" />
            </div>
            <span className="text-sm font-medium">New Image</span>
          </Link>
          <Link
            href="/batch"
            className="flex items-center gap-3 rounded-xl bg-surface p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-surface-dark"
          >
            <div className="rounded-lg bg-warning/10 p-2">
              <Layers size={18} className="text-warning" />
            </div>
            <span className="text-sm font-medium">Batch Mode</span>
          </Link>
          <Link
            href="/gallery"
            className="flex items-center gap-3 rounded-xl bg-surface p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-surface-dark"
          >
            <div className="rounded-lg bg-success/10 p-2">
              <Images size={18} className="text-success" />
            </div>
            <span className="text-sm font-medium">Gallery</span>
          </Link>
          <Link
            href="/pricing"
            className="flex items-center gap-3 rounded-xl bg-surface p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-surface-dark"
          >
            <div className="rounded-lg bg-primary-light/10 p-2">
              <Zap size={18} className="text-primary-light" />
            </div>
            <span className="text-sm font-medium">Upgrade</span>
          </Link>
        </div>
      </div>

      {/* Recent Projects */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
            Recent Projects
          </h2>
          {hasHistory && (
            <Link
              href="/gallery"
              className="text-xs font-medium text-primary hover:underline"
            >
              View All
            </Link>
          )}
        </div>

        {!hasHistory ? (
          <div className="rounded-xl bg-surface p-6 text-center shadow-sm dark:bg-surface-dark">
            <Sparkles
              size={24}
              className="mx-auto mb-2 text-text-muted dark:text-text-muted-dark"
            />
            <p className="text-sm text-text-muted dark:text-text-muted-dark">
              No projects yet — start by generating your first image!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentJobs.map((job) => (
              <Link
                key={job.id}
                href="/gallery"
                className="flex items-center justify-between rounded-xl bg-surface p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-surface-dark"
              >
                <div className="flex items-center gap-3">
                  {job.images[0] ? (
                    <img
                      src={job.images[0].resultImageData}
                      alt=""
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Camera size={20} className="text-primary" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-text dark:text-text-dark">
                      {job.originalFileName}
                    </p>
                    <p className="text-xs text-text-muted dark:text-text-muted-dark">
                      {job.images.length} images · {job.scenes.length} scenes
                    </p>
                  </div>
                </div>
                <ArrowRight
                  size={16}
                  className="text-text-muted dark:text-text-muted-dark"
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
