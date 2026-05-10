import type { Scene } from "@/types";

/**
 * @description 预设营销场景列表
 */
export const SCENES: Scene[] = [
  {
    id: "studio-white",
    name: "Studio White",
    description: "Clean white studio background — classic e-commerce look",
    thumbnail: "⬜",
    category: "studio",
  },
  {
    id: "studio-gradient",
    name: "Studio Gradient",
    description: "Soft gray gradient for a premium feel",
    thumbnail: "🔲",
    category: "studio",
  },
  {
    id: "lifestyle-desk",
    name: "Wooden Desk",
    description: "Warm wooden desk surface with soft lighting",
    thumbnail: "🪵",
    category: "lifestyle",
  },
  {
    id: "lifestyle-nature",
    name: "Nature Green",
    description: "Fresh green nature backdrop for organic products",
    thumbnail: "🌿",
    category: "lifestyle",
  },
  {
    id: "lifestyle-kitchen",
    name: "Kitchen",
    description: "Warm kitchen environment for food & home products",
    thumbnail: "🍳",
    category: "lifestyle",
  },
  {
    id: "lifestyle-bathroom",
    name: "Bathroom",
    description: "Clean blue tones for beauty & wellness products",
    thumbnail: "🛁",
    category: "lifestyle",
  },
  {
    id: "festive-christmas",
    name: "Christmas",
    description: "Festive red & green holiday theme",
    thumbnail: "🎄",
    category: "festive",
  },
  {
    id: "festive-valentines",
    name: "Valentine's",
    description: "Romantic pink tones for Valentine's promotions",
    thumbnail: "💕",
    category: "festive",
  },
  {
    id: "minimal-shadow",
    name: "Minimal Shadow",
    description: "Clean surface with natural product shadow",
    thumbnail: "🌑",
    category: "minimal",
  },
  {
    id: "minimal-marble",
    name: "Marble",
    description: "Elegant marble surface for luxury products",
    thumbnail: "🪨",
    category: "minimal",
  },
];

/**
 * @description 场景分类标签
 */
export const SCENE_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "studio", label: "Studio" },
  { id: "lifestyle", label: "Lifestyle" },
  { id: "festive", label: "Festive" },
  { id: "minimal", label: "Minimal" },
] as const;
