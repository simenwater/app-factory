"use client";

/**
 * @description 订阅定价页面组件
 */

import { Check, Zap, Crown, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  icon: React.ReactNode;
  features: PlanFeature[];
  popular?: boolean;
  cta: string;
}

const PLANS: Plan[] = [
  {
    name: "免费版",
    price: "$0",
    period: "永久免费",
    description: "适合刚起步的自由职业者",
    icon: <Zap className="h-6 w-6 text-primary" />,
    features: [
      { text: "最多 3 个活跃项目", included: true },
      { text: "基础客户管理", included: true },
      { text: "基础报价单和发票", included: true },
      { text: "收入追踪", included: true },
      { text: "AI 功能", included: false },
      { text: "自定义品牌发票", included: false },
      { text: "无限项目", included: false },
      { text: "优先支持", included: false },
    ],
    cta: "当前方案",
  },
  {
    name: "专业版",
    price: "$9",
    period: "/月",
    description: "适合成长中的独立创作者",
    icon: <Crown className="h-6 w-6 text-warning" />,
    popular: true,
    features: [
      { text: "无限活跃项目", included: true },
      { text: "高级客户管理", included: true },
      { text: "AI 智能报价生成", included: true },
      { text: "自定义品牌发票", included: true },
      { text: "AI 合同草案生成", included: true },
      { text: "AI 客户跟进邮件", included: true },
      { text: "高级税务估算", included: true },
      { text: "优先邮件支持", included: true },
    ],
    cta: "升级专业版",
  },
  {
    name: "终身版",
    price: "$99",
    period: "一次性",
    description: "早期用户专享终身特惠",
    icon: <Star className="h-6 w-6 text-accent" />,
    features: [
      { text: "专业版所有功能", included: true },
      { text: "终身免费更新", included: true },
      { text: "无限历史数据", included: true },
      { text: "API 访问权限", included: true },
      { text: "优先功能请求", included: true },
      { text: "1v1 视频支持", included: true },
      { text: "白标定制", included: true },
      { text: "早期用户社区", included: true },
    ],
    cta: "终身买断",
  },
];

/**
 * @description 定价方案展示
 */
export function PricingPlans() {
  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-text dark:text-text-dark">升级你的工作流</h1>
        <p className="mt-2 text-text-muted dark:text-text-muted-dark">
          选择最适合你的方案，让 AI 帮你消除行政琐事
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
        {PLANS.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              "relative flex flex-col",
              plan.popular && "border-2 border-primary shadow-lg shadow-primary/10"
            )}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                最受欢迎
              </div>
            )}

            <div className="mb-4 flex items-center gap-3">
              {plan.icon}
              <div>
                <h3 className="font-semibold text-text dark:text-text-dark">{plan.name}</h3>
                <p className="text-xs text-text-muted dark:text-text-muted-dark">
                  {plan.description}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold text-text dark:text-text-dark">
                {plan.price}
              </span>
              <span className="text-sm text-text-muted dark:text-text-muted-dark">
                {plan.period}
              </span>
            </div>

            <ul className="mb-6 flex-1 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature.text} className="flex items-center gap-2 text-sm">
                  <Check
                    className={cn(
                      "h-4 w-4 flex-shrink-0",
                      feature.included
                        ? "text-success"
                        : "text-border dark:text-border-dark"
                    )}
                  />
                  <span
                    className={cn(
                      feature.included
                        ? "text-text dark:text-text-dark"
                        : "text-text-muted line-through dark:text-text-muted-dark"
                    )}
                  >
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>

            <Button
              variant={plan.popular ? "primary" : "secondary"}
              className="w-full"
              onClick={() => alert(`${plan.name} 支付集成即将上线！`)}
            >
              {plan.cta}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
