/**
 * @fileoverview Dashboard 首页 — 展示概览统计和快速操作入口
 */
"use client";

import Link from "next/link";
import { useStore } from "@/store/useStore";
import {
  FileText,
  Briefcase,
  LayoutDashboard,
  TrendingUp,
  Upload,
  Target,
  Rocket,
  ArrowRight,
} from "lucide-react";

/**
 * @returns Dashboard 页面
 */
export default function DashboardPage() {
  const resumes = useStore((s) => s.resumes);
  const applications = useStore((s) => s.applications);
  const matchResults = useStore((s) => s.matchResults);
  const quota = useStore((s) => s.quota);

  const activeApps = applications.filter((a) => !["rejected", "withdrawn"].includes(a.status));
  const avgScore = matchResults.length > 0
    ? Math.round(matchResults.reduce((sum, r) => sum + r.overallScore, 0) / matchResults.length)
    : 0;

  const stats = [
    { label: "Resumes", value: resumes.length, icon: FileText, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Active Applications", value: activeApps.length, icon: Briefcase, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20" },
    { label: "Matches Analyzed", value: matchResults.length, icon: Target, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20" },
    { label: "Avg Match Score", value: `${avgScore}%`, icon: TrendingUp, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
  ];

  const quickActions = [
    { href: "/resume/optimize", label: "Optimize Resume", desc: "Upload & improve your resume with AI", icon: Upload, color: "from-indigo-500 to-purple-500" },
    { href: "/jobs/match", label: "Match Job", desc: "Analyze resume-JD fit score", icon: Target, color: "from-emerald-500 to-teal-500" },
    { href: "/tracker", label: "Track Applications", desc: "Manage your job applications", icon: LayoutDashboard, color: "from-amber-500 to-orange-500" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Rocket className="w-8 h-8" />
            <h1 className="text-3xl font-bold">CareerPilot AI</h1>
          </div>
          <p className="text-indigo-100 max-w-lg">
            Your AI-powered career co-pilot. Optimize resumes, match job descriptions,
            and track applications — all in one place.
          </p>

          {quota.plan === "free" && (
            <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-sm">
              <span>Free trial: {quota.optimizationsLimit - quota.optimizationsUsed} optimizations left</span>
              <Link href="/pricing" className="underline font-medium">
                Upgrade →
              </Link>
            </div>
          )}
        </div>
        <div className="absolute -right-10 -top-10 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-10 -bottom-10 w-48 h-48 rounded-full bg-white/5 blur-2xl" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4"
          >
            <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {quickActions.map(({ href, label, desc, icon: Icon, color }) => (
            <Link
              key={href}
              href={href}
              className="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{label}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
              <ArrowRight className="absolute bottom-6 right-6 w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {applications.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Applications</h2>
            <Link href="/tracker" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {applications.slice(0, 5).map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
              >
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{app.jobTitle}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{app.company}</div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * @param status - 申请状态
 * @returns 对应的 Tailwind 类名
 */
function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    wishlist: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    applied: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    screening: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    interviewing: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    offer: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    withdrawn: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
  };
  return map[status] || map.wishlist;
}
