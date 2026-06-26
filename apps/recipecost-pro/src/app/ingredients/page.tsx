"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { generateId, formatCurrency, CATEGORY_CONFIG, UNIT_LABELS } from "@/lib/utils";
import { EmptyState } from "@/components/EmptyState";
import type { Ingredient, IngredientCategory, Unit } from "@/types";
import { Package, Plus, Trash2, Search, X, Pencil } from "lucide-react";

/**
 * @description 食材库管理页面
 */
export default function IngredientsPage() {
  const ingredients = useStore((s) => s.ingredients);
  const addIngredient = useStore((s) => s.addIngredient);
  const updateIngredient = useStore((s) => s.updateIngredient);
  const removeIngredient = useStore((s) => s.removeIngredient);
  const currency = useStore((s) => s.settings.currency);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<IngredientCategory | "all">("all");

  const [name, setName] = useState("");
  const [category, setCategory] = useState<IngredientCategory>("vegetable");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState<Unit>("kg");
  const [quantity, setQuantity] = useState("1");

  const filteredIngredients = ingredients.filter((i) => {
    const matchesSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || i.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  /**
   * @description 重置表单状态
   */
  function resetForm() {
    setName("");
    setCategory("vegetable");
    setPrice("");
    setUnit("kg");
    setQuantity("1");
    setEditingId(null);
    setShowForm(false);
  }

  /**
   * @description 编辑食材 — 填充表单
   */
  function handleEdit(ingredient: Ingredient) {
    setName(ingredient.name);
    setCategory(ingredient.category);
    setPrice(ingredient.price.toString());
    setUnit(ingredient.unit);
    setQuantity(ingredient.quantity.toString());
    setEditingId(ingredient.id);
    setShowForm(true);
  }

  /**
   * @description 提交表单（新建或更新）
   */
  function handleSubmit() {
    if (!name.trim() || !price || parseFloat(price) <= 0) return;

    if (editingId) {
      updateIngredient(editingId, {
        name: name.trim(),
        category,
        price: parseFloat(price),
        unit,
        quantity: parseFloat(quantity) || 1,
      });
    } else {
      const now = new Date().toISOString();
      addIngredient({
        id: generateId(),
        name: name.trim(),
        category,
        price: parseFloat(price),
        unit,
        quantity: parseFloat(quantity) || 1,
        createdAt: now,
        updatedAt: now,
      });
    }
    resetForm();
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text dark:text-text-dark">
          食材库
        </h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
        >
          <Plus size={16} />
          添加食材
        </button>
      </div>

      {showForm && (
        <div className="mb-4 rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-text dark:text-text-dark">
              {editingId ? "编辑食材" : "添加食材"}
            </h3>
            <button onClick={resetForm} className="text-text-muted dark:text-text-muted-dark">
              <X size={18} />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-text-muted dark:text-text-muted-dark">
                食材名称
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="如：猪肉、白菜、酱油"
                className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text dark:border-border-dark dark:bg-bg-dark dark:text-text-dark"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-text-muted dark:text-text-muted-dark">
                分类
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as IngredientCategory)}
                className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text dark:border-border-dark dark:bg-bg-dark dark:text-text-dark"
              >
                {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                  <option key={key} value={key}>
                    {cfg.emoji} {cfg.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-text-muted dark:text-text-muted-dark">
                  价格
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text dark:border-border-dark dark:bg-bg-dark dark:text-text-dark"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-text-muted dark:text-text-muted-dark">
                  数量
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="1"
                  min="0.01"
                  step="0.01"
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text dark:border-border-dark dark:bg-bg-dark dark:text-text-dark"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-text-muted dark:text-text-muted-dark">
                  单位
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as Unit)}
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text dark:border-border-dark dark:bg-bg-dark dark:text-text-dark"
                >
                  {Object.entries(UNIT_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label} ({key})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!name.trim() || !price || parseFloat(price) <= 0}
              className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
            >
              {editingId ? "保存修改" : "添加食材"}
            </button>
          </div>
        </div>
      )}

      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-text-muted-dark"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索食材..."
            className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-text dark:border-border-dark dark:bg-surface-dark dark:text-text-dark"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value as IngredientCategory | "all")}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text dark:border-border-dark dark:bg-surface-dark dark:text-text-dark"
        >
          <option value="all">全部</option>
          {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
            <option key={key} value={key}>
              {cfg.emoji} {cfg.label}
            </option>
          ))}
        </select>
      </div>

      {filteredIngredients.length === 0 ? (
        <EmptyState
          icon={Package}
          title={ingredients.length === 0 ? "食材库为空" : "没有匹配结果"}
          description={
            ingredients.length === 0
              ? "点击「添加食材」开始管理您的食材价格"
              : "尝试调整搜索条件或分类筛选"
          }
        />
      ) : (
        <div className="space-y-2">
          {filteredIngredients.map((ingredient) => (
            <div
              key={ingredient.id}
              className="flex items-center justify-between rounded-xl bg-surface p-3 shadow-sm dark:bg-surface-dark"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  {CATEGORY_CONFIG[ingredient.category].emoji}
                </span>
                <div>
                  <p className="font-medium text-text dark:text-text-dark">
                    {ingredient.name}
                  </p>
                  <p className="text-xs text-text-muted dark:text-text-muted-dark">
                    {formatCurrency(ingredient.price, currency)} / {ingredient.quantity}
                    {ingredient.unit}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleEdit(ingredient)}
                  className="rounded-lg p-2 text-text-muted transition-colors hover:bg-border/50 dark:text-text-muted-dark dark:hover:bg-border-dark/50"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`确定删除食材「${ingredient.name}」吗？`)) {
                      removeIngredient(ingredient.id);
                    }
                  }}
                  className="rounded-lg p-2 text-danger transition-colors hover:bg-danger/10"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
