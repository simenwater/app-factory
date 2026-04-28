/**
 * @fileoverview MVP 演示用的模拟数据
 */

import type {
  Comment,
  Project,
  User,
  Integration,
  TeamSettings,
  Notification,
} from '@/types';

/** @description 模拟用户数据 */
export const mockUsers: User[] = [
  { id: 'u1', name: '张明', email: 'zhangming@example.com', avatar: undefined, role: 'owner' },
  { id: 'u2', name: 'Sarah Chen', email: 'sarah@example.com', avatar: undefined, role: 'admin' },
  { id: 'u3', name: '李华', email: 'lihua@example.com', avatar: undefined, role: 'member' },
  { id: 'u4', name: 'Alex Kim', email: 'alex@example.com', avatar: undefined, role: 'member' },
  { id: 'u5', name: '王芳', email: 'wangfang@example.com', avatar: undefined, role: 'viewer' },
];

/** @description 模拟项目数据 */
export const mockProjects: Project[] = [
  {
    id: 'p1',
    name: 'Marketing Website',
    url: 'https://www.example.com',
    description: '公司主站 — 品牌展示与产品介绍',
    members: [mockUsers[0], mockUsers[1], mockUsers[2]],
    commentCount: 24,
    openCommentCount: 8,
    createdAt: '2026-03-15T08:00:00Z',
    updatedAt: '2026-04-27T14:30:00Z',
  },
  {
    id: 'p2',
    name: 'Dashboard App',
    url: 'https://app.example.com',
    description: '内部数据分析仪表盘',
    members: [mockUsers[0], mockUsers[3], mockUsers[4]],
    commentCount: 42,
    openCommentCount: 15,
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-04-28T09:15:00Z',
  },
  {
    id: 'p3',
    name: 'Mobile Landing',
    url: 'https://m.example.com',
    description: '移动端落地页',
    members: [mockUsers[1], mockUsers[2], mockUsers[4]],
    commentCount: 11,
    openCommentCount: 3,
    createdAt: '2026-04-01T12:00:00Z',
    updatedAt: '2026-04-25T16:00:00Z',
  },
];

/** @description 模拟评论数据 */
export const mockComments: Comment[] = [
  {
    id: 'c1',
    projectId: 'p1',
    author: mockUsers[1],
    content: '这个按钮的颜色与品牌色不一致，应该使用 #4F46E5 而不是 #6366F1',
    element: {
      selector: 'header > nav > button.cta-primary',
      xpath: '/html/body/header/nav/button[2]',
      tagName: 'BUTTON',
      textContent: 'Get Started',
    },
    pageUrl: 'https://www.example.com/',
    status: 'open',
    priority: 'medium',
    category: 'design',
    assignee: mockUsers[2],
    replies: [
      {
        id: 'r1',
        author: mockUsers[2],
        content: '收到，我这边来修复这个颜色问题。',
        createdAt: '2026-04-27T15:00:00Z',
      },
    ],
    createdAt: '2026-04-27T14:30:00Z',
    updatedAt: '2026-04-27T15:00:00Z',
  },
  {
    id: 'c2',
    projectId: 'p1',
    author: mockUsers[0],
    content: '页脚的链接有拼写错误，"Privcy" 应该改为 "Privacy"',
    element: {
      selector: 'footer > div.links > a:nth-child(3)',
      xpath: '/html/body/footer/div[2]/a[3]',
      tagName: 'A',
      textContent: 'Privcy Policy',
    },
    pageUrl: 'https://www.example.com/',
    status: 'resolved',
    priority: 'low',
    category: 'content',
    assignee: mockUsers[1],
    replies: [],
    createdAt: '2026-04-20T10:00:00Z',
    updatedAt: '2026-04-21T09:00:00Z',
  },
  {
    id: 'c3',
    projectId: 'p2',
    author: mockUsers[3],
    content: '数据加载时没有 loading 状态显示，用户体验很差',
    element: {
      selector: '#dashboard-main > .chart-container',
      xpath: '/html/body/main/div[1]/div[2]',
      tagName: 'DIV',
      textContent: '',
    },
    pageUrl: 'https://app.example.com/dashboard',
    status: 'in_progress',
    priority: 'high',
    category: 'functionality',
    assignee: mockUsers[0],
    replies: [
      {
        id: 'r2',
        author: mockUsers[0],
        content: '已经在开发中，预计今天完成。',
        createdAt: '2026-04-28T10:00:00Z',
      },
    ],
    jiraTicketId: 'DASH-142',
    createdAt: '2026-04-28T09:15:00Z',
    updatedAt: '2026-04-28T10:00:00Z',
  },
  {
    id: 'c4',
    projectId: 'p2',
    author: mockUsers[4],
    content: '图表在移动端显示不完整，需要添加横向滚动支持',
    element: {
      selector: '#dashboard-main > .chart-container > canvas',
      xpath: '/html/body/main/div[1]/div[2]/canvas',
      tagName: 'CANVAS',
      textContent: '',
    },
    pageUrl: 'https://app.example.com/analytics',
    status: 'open',
    priority: 'high',
    category: 'bug',
    replies: [],
    createdAt: '2026-04-26T11:00:00Z',
    updatedAt: '2026-04-26T11:00:00Z',
  },
  {
    id: 'c5',
    projectId: 'p2',
    author: mockUsers[1],
    content: '这个表格的排序功能有问题，点击列头后数据没有正确排序',
    element: {
      selector: '#data-table > thead > tr > th:nth-child(2)',
      xpath: '/html/body/main/div[2]/table/thead/tr/th[2]',
      tagName: 'TH',
      textContent: 'Revenue',
    },
    pageUrl: 'https://app.example.com/reports',
    status: 'open',
    priority: 'critical',
    category: 'bug',
    assignee: mockUsers[3],
    replies: [],
    jiraTicketId: 'DASH-145',
    createdAt: '2026-04-25T16:30:00Z',
    updatedAt: '2026-04-25T16:30:00Z',
  },
  {
    id: 'c6',
    projectId: 'p3',
    author: mockUsers[2],
    content: 'Hero 区域的背景图在视网膜屏幕上模糊，需要提供 @2x 版本',
    element: {
      selector: '.hero-section > .bg-image',
      xpath: '/html/body/main/section[1]/div[1]',
      tagName: 'DIV',
      textContent: '',
    },
    pageUrl: 'https://m.example.com/',
    status: 'open',
    priority: 'medium',
    category: 'design',
    assignee: mockUsers[1],
    replies: [],
    createdAt: '2026-04-24T13:00:00Z',
    updatedAt: '2026-04-24T13:00:00Z',
  },
  {
    id: 'c7',
    projectId: 'p1',
    author: mockUsers[3],
    content: '页面加载速度过慢，首屏时间超过 3 秒，需要优化图片和脚本',
    element: {
      selector: 'body',
      xpath: '/html/body',
      tagName: 'BODY',
      textContent: '',
    },
    pageUrl: 'https://www.example.com/',
    status: 'open',
    priority: 'high',
    category: 'performance',
    replies: [],
    createdAt: '2026-04-23T09:00:00Z',
    updatedAt: '2026-04-23T09:00:00Z',
  },
];

/** @description 模拟集成数据 */
export const mockIntegrations: Integration[] = [
  {
    id: 'int1',
    type: 'slack',
    enabled: true,
    config: {
      webhookUrl: 'https://hooks.slack.com/services/T00/B00/xxx',
      channel: '#design-feedback',
    },
    connected: true,
    lastSyncAt: '2026-04-28T10:00:00Z',
  },
  {
    id: 'int2',
    type: 'jira',
    enabled: true,
    config: {
      baseUrl: 'https://team.atlassian.net',
      projectKey: 'DASH',
      email: 'admin@example.com',
    },
    connected: true,
    lastSyncAt: '2026-04-28T09:30:00Z',
  },
  {
    id: 'int3',
    type: 'linear',
    enabled: false,
    config: {},
    connected: false,
  },
];

/** @description 模拟团队设置 */
export const mockTeamSettings: TeamSettings = {
  id: 'team1',
  name: 'Acme Design Team',
  subscription: {
    plan: 'team',
    currentUsers: 5,
    maxUsers: 10,
    pricePerUser: 15,
    trialEndsAt: '2026-05-12T00:00:00Z',
    nextBillingAt: '2026-05-12T00:00:00Z',
  },
  members: mockUsers,
  integrations: mockIntegrations,
};

/** @description 模拟通知数据 */
export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'comment',
    title: '新评论',
    message: 'Sarah Chen 在 Marketing Website 上添加了新评论',
    read: false,
    commentId: 'c1',
    createdAt: '2026-04-27T14:30:00Z',
  },
  {
    id: 'n2',
    type: 'assign',
    title: '任务分配',
    message: '你被分配处理 Dashboard App 的一个 Bug',
    read: false,
    commentId: 'c3',
    createdAt: '2026-04-28T09:15:00Z',
  },
  {
    id: 'n3',
    type: 'reply',
    title: '新回复',
    message: '李华 回复了你的评论',
    read: true,
    commentId: 'c1',
    createdAt: '2026-04-27T15:00:00Z',
  },
  {
    id: 'n4',
    type: 'status_change',
    title: '状态更新',
    message: '评论 "页脚链接拼写错误" 已标记为已解决',
    read: true,
    commentId: 'c2',
    createdAt: '2026-04-21T09:00:00Z',
  },
];
