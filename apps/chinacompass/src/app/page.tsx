"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Globe,
  FileText,
  MessageSquare,
  AlertTriangle,
  Briefcase,
  ArrowRight,
  TrendingUp,
  Shield,
  Zap,
} from "lucide-react";
import PolicyCard from "@/components/PolicyCard";
import RiskBadge from "@/components/RiskBadge";
import type { Policy, RiskAssessment } from "@/types";
import { mockPolicies, mockRiskAssessments } from "@/lib/mockData";

/**
 * @description 首页 - 产品总览和快捷入口
 */
export default function HomePage() {
  const [latestPolicies, setLatestPolicies] = useState<Policy[]>([]);
  const [topRisks, setTopRisks] = useState<RiskAssessment[]>([]);

  useEffect(() => {
    setLatestPolicies(mockPolicies.slice(0, 4));
    setTopRisks(
      mockRiskAssessments
        .filter((r) => r.riskLevel === "critical" || r.riskLevel === "high")
        .slice(0, 3)
    );
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white px-6 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-6 h-6 text-brand-400" />
            <span className="text-brand-300 text-sm font-medium">
              ChinaCompass
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            中国出海企业
            <br />
            <span className="text-brand-400">全球合规AI助手</span>
          </h1>
          <p className="text-navy-200 text-lg max-w-2xl mb-8 leading-relaxed">
            实时监控目标市场政策变化，提供AI中文解读和合规建议，降低出海风险，助力中国企业全球化。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/policies"
              className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <FileText className="w-4 h-4" />
              查看最新政策
            </Link>
            <Link
              href="/advisor"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              咨询AI顾问
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 -mt-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "监控国家", value: "10+", icon: Globe, color: "text-blue-600" },
            { label: "政策动态", value: "500+", icon: FileText, color: "text-green-600" },
            { label: "风险预警", value: "实时", icon: AlertTriangle, color: "text-orange-600" },
            { label: "案例分析", value: "100+", icon: Briefcase, color: "text-purple-600" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Risk Alerts */}
      {topRisks.length > 0 && (
        <section className="px-6 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                风险预警
              </h2>
              <Link
                href="/risk"
                className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                查看全部 <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {topRisks.map((risk) => (
                <div
                  key={risk.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-4 hover:shadow-md transition-shadow"
                >
                  <RiskBadge level={risk.riskLevel} size="md" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">
                      {risk.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {risk.description.slice(0, 80)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Policies */}
      <section className="px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-navy-600" />
              最新政策动态
            </h2>
            <Link
              href="/policies"
              className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              查看全部 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {latestPolicies.map((policy) => (
              <PolicyCard key={policy.id} policy={policy} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-12 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            为什么选择 ChinaCompass？
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "实时政策监控",
                desc: "覆盖美、欧、日、东南亚等10+国家和地区，自动抓取并分析最新政策变化。",
                color: "bg-blue-50 text-blue-600",
              },
              {
                icon: Shield,
                title: "AI中文解读",
                desc: "将复杂的外文政策法规翻译并解读为中文，直接告诉你「对我有什么影响」。",
                color: "bg-green-50 text-green-600",
              },
              {
                icon: TrendingUp,
                title: "风险预警",
                desc: "智能评估出海风险等级，及时推送预警，让你在风险来临之前做好准备。",
                color: "bg-orange-50 text-orange-600",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="text-center p-6 rounded-2xl hover:shadow-lg transition-shadow"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mx-auto mb-4`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-12">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-navy-800 to-navy-900 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">开始您的全球合规之旅</h2>
          <p className="text-navy-200 mb-6">
            免费注册，立即体验AI驱动的出海合规服务
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/advisor"
              className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              免费咨询
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              查看方案
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
