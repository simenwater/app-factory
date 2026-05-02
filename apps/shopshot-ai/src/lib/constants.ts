import type { PlatformPreset, SceneTemplate } from '@/types';

/**
 * @description 平台尺寸预设配置
 */
export const PLATFORM_PRESETS: PlatformPreset[] = [
  { id: 'amazon-main', name: 'Amazon 主图', platform: 'Amazon', width: 2000, height: 2000 },
  { id: 'amazon-listing', name: 'Amazon 副图', platform: 'Amazon', width: 1500, height: 1500 },
  { id: 'shopify-square', name: 'Shopify 方图', platform: 'Shopify', width: 2048, height: 2048 },
  { id: 'shopify-landscape', name: 'Shopify 横图', platform: 'Shopify', width: 4472, height: 2048 },
  { id: 'ebay-gallery', name: 'eBay 画廊', platform: 'eBay', width: 1600, height: 1600 },
  { id: 'etsy-listing', name: 'Etsy 列表', platform: 'Etsy', width: 2700, height: 2025 },
  { id: 'instagram-square', name: 'Instagram 方图', platform: 'Instagram', width: 1080, height: 1080 },
  { id: 'instagram-story', name: 'Instagram Story', platform: 'Instagram', width: 1080, height: 1920 },
];

/**
 * @description 场景模板配置
 */
export const SCENE_TEMPLATES: SceneTemplate[] = [
  { id: 'studio-white', name: '纯白背景', thumbnail: '/scenes/white.jpg', prompt: 'product on pure white background, studio lighting' },
  { id: 'marble-table', name: '大理石台面', thumbnail: '/scenes/marble.jpg', prompt: 'product on marble table, elegant setting' },
  { id: 'wooden-table', name: '木质桌面', thumbnail: '/scenes/wood.jpg', prompt: 'product on wooden table, natural warm lighting' },
  { id: 'lifestyle-kitchen', name: '厨房场景', thumbnail: '/scenes/kitchen.jpg', prompt: 'product in modern kitchen, lifestyle photography' },
  { id: 'lifestyle-office', name: '办公场景', thumbnail: '/scenes/office.jpg', prompt: 'product on office desk, professional environment' },
  { id: 'outdoor-garden', name: '户外花园', thumbnail: '/scenes/garden.jpg', prompt: 'product in garden setting, natural daylight' },
  { id: 'gradient-blue', name: '渐变蓝', thumbnail: '/scenes/gradient-blue.jpg', prompt: 'product on blue gradient background, soft lighting' },
  { id: 'gradient-pink', name: '渐变粉', thumbnail: '/scenes/gradient-pink.jpg', prompt: 'product on pink gradient background, feminine aesthetic' },
];

/**
 * @description 多角度视图配置
 */
export const VIEW_ANGLES = [
  { id: 'front', name: '正面', angle: 0 },
  { id: 'left-45', name: '左侧 45°', angle: -45 },
  { id: 'right-45', name: '右侧 45°', angle: 45 },
  { id: 'top', name: '俯视', angle: 90 },
  { id: 'back', name: '背面', angle: 180 },
  { id: 'left-side', name: '左侧', angle: -90 },
];

/**
 * @description 订阅计划定价
 */
export const PRICING_PLANS = [
  {
    id: 'free',
    name: '免费试用',
    price: 0,
    credits: 10,
    period: '7天',
    features: ['10 张免费生成额度', '基础背景移除', '标准尺寸导出'],
  },
  {
    id: 'basic',
    name: '基础版',
    price: 9.9,
    credits: 50,
    period: '月',
    features: ['每月 50 张生成额度', '多角度 3D 视图', '全部场景模板', '全平台尺寸导出', '优先处理'],
  },
  {
    id: 'pro',
    name: '专业版',
    price: 29.9,
    credits: 200,
    period: '月',
    features: ['每月 200 张生成额度', '全部基础版功能', '批量处理', 'API 接入', '专属客服'],
  },
] as const;
