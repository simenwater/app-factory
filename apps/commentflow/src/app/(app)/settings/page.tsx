'use client';

/**
 * @fileoverview 设置页面 — 团队管理、订阅计划、账户设置
 */

import { useState } from 'react';
import {
  Users,
  CreditCard,
  Shield,
  Crown,
  Check,
  UserPlus,
  Trash2,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn, formatDate } from '@/lib/utils';
import Avatar from '@/components/Avatar';
import type { SubscriptionPlan, UserRole } from '@/types';

/** @description 订阅计划详情 */
const plans: {
  plan: SubscriptionPlan;
  name: string;
  price: string;
  features: string[];
  recommended?: boolean;
}[] = [
  {
    plan: 'free',
    name: 'Free',
    price: '$0',
    features: [
      '最多 1 个项目',
      '最多 3 个用户',
      '基础评论功能',
      '7 天评论历史',
    ],
  },
  {
    plan: 'team',
    name: 'Team',
    price: '$15/用户/月',
    recommended: true,
    features: [
      '无限项目',
      '最多 50 个用户',
      'Slack & Jira 集成',
      '无限评论历史',
      'Chrome 扩展',
      '优先支持',
      '14 天免费试用',
    ],
  },
  {
    plan: 'enterprise',
    name: 'Enterprise',
    price: '定制',
    features: [
      '无限项目与用户',
      '所有集成',
      'SSO 单点登录',
      '自定义域名',
      '专属客户经理',
      'SLA 服务保障',
      'API 访问权限',
    ],
  },
];

const roleLabels: Record<UserRole, string> = {
  owner: '所有者',
  admin: '管理员',
  member: '成员',
  viewer: '观察者',
};

export default function SettingsPage() {
  const { teamSettings, members } = useStore();
  const [activeTab, setActiveTab] = useState<'team' | 'billing' | 'account'>('team');
  const [inviteEmail, setInviteEmail] = useState('');

  const tabs = [
    { id: 'team' as const, label: '团队成员', icon: Users },
    { id: 'billing' as const, label: '订阅与计费', icon: CreditCard },
    { id: 'account' as const, label: '账户设置', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold">设置</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          管理团队、订阅计划和账户配置
        </p>
      </div>

      {/* Tab 切换 */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors',
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* 团队成员 */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          {/* 邀请成员 */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
            <h3 className="font-semibold mb-3">邀请新成员</h3>
            <div className="flex gap-3">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="输入邮箱地址..."
                className="flex-1 px-3 py-2 text-sm bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <select className="px-3 py-2 text-sm bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none">
                <option value="member">成员</option>
                <option value="admin">管理员</option>
                <option value="viewer">观察者</option>
              </select>
              <button
                disabled={!inviteEmail}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg disabled:opacity-50 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                邀请
              </button>
            </div>
          </div>

          {/* 成员列表 */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-800">
              <h3 className="font-semibold">
                团队成员 ({members.length}/{teamSettings.subscription.maxUsers})
              </h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar user={member} />
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      'text-xs px-2 py-1 rounded-full',
                      member.role === 'owner'
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    )}>
                      {member.role === 'owner' && <Crown className="w-3 h-3 inline mr-1" />}
                      {roleLabels[member.role]}
                    </span>
                    {member.role !== 'owner' && (
                      <button className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 订阅与计费 */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          {/* 当前计划 */}
          <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-primary-800 dark:text-primary-200">
                  当前计划：{plans.find(p => p.plan === teamSettings.subscription.plan)?.name}
                </h3>
                <p className="text-sm text-primary-600 dark:text-primary-400 mt-1">
                  {teamSettings.subscription.currentUsers} 个用户 · ${teamSettings.subscription.pricePerUser}/用户/月
                </p>
              </div>
              {teamSettings.subscription.trialEndsAt && (
                <div className="text-right">
                  <p className="text-sm font-medium text-primary-700 dark:text-primary-300">
                    试用期至
                  </p>
                  <p className="text-sm text-primary-600 dark:text-primary-400">
                    {formatDate(teamSettings.subscription.trialEndsAt, 'yyyy-MM-dd')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 计划选择 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => {
              const isCurrent = plan.plan === teamSettings.subscription.plan;
              return (
                <div
                  key={plan.plan}
                  className={cn(
                    'rounded-xl border-2 p-5 relative',
                    isCurrent
                      ? 'border-primary-500 bg-white dark:bg-gray-900'
                      : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'
                  )}
                >
                  {plan.recommended && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary-600 text-white text-xs font-medium rounded-full">
                      推荐
                    </span>
                  )}
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                  <p className="text-2xl font-bold mt-2">{plan.price}</p>
                  <ul className="mt-4 space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Check className="w-4 h-4 text-green-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={cn(
                      'w-full mt-5 py-2 text-sm font-medium rounded-lg transition-colors',
                      isCurrent
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-default'
                        : 'bg-primary-600 hover:bg-primary-700 text-white'
                    )}
                    disabled={isCurrent}
                  >
                    {isCurrent ? '当前计划' : '升级'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 账户设置 */}
      {activeTab === 'account' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
            <h3 className="font-semibold">团队信息</h3>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">团队名称</label>
              <input
                type="text"
                defaultValue={teamSettings.name}
                className="mt-1 w-full px-3 py-2 text-sm bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">团队 ID</label>
              <input
                type="text"
                value={teamSettings.id}
                readOnly
                className="mt-1 w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-500"
              />
            </div>
            <button className="px-4 py-2 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
              保存更改
            </button>
          </div>

          {/* Chrome 扩展安装密钥 */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-3">
            <h3 className="font-semibold">Chrome 扩展</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              安装 Chrome 扩展后，使用以下 API Key 连接你的团队账户。
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value="cf_key_a1b2c3d4e5f6g7h8i9j0"
                readOnly
                className="flex-1 px-3 py-2 text-sm font-mono bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg"
              />
              <button className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                复制
              </button>
              <button className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                重新生成
              </button>
            </div>
          </div>

          {/* 危险区域 */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-red-200 dark:border-red-900 p-5">
            <h3 className="font-semibold text-red-600 dark:text-red-400">危险操作</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              以下操作不可撤销，请谨慎操作。
            </p>
            <div className="flex gap-3 mt-4">
              <button className="px-4 py-2 text-sm border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                导出所有数据
              </button>
              <button className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                删除团队
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
