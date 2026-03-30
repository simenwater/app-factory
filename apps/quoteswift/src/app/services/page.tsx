"use client";

import { useState } from "react";
import { Wrench, Plus, Pencil, Trash2, Search, X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useStore } from "@/store/useStore";
import { formatCurrency } from "@/lib/utils";
import { EmptyState } from "@/components/EmptyState";
import type { ServiceItem } from "@/types";

/**
 * @description 服务项目与单价库页面
 */
export default function ServicesPage() {
  const services = useStore((s) => s.services);
  const addService = useStore((s) => s.addService);
  const updateService = useStore((s) => s.updateService);
  const deleteService = useStore((s) => s.deleteService);
  const currency = useStore((s) => s.settings.currency);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    unitPrice: "",
    unit: "次",
    category: "",
  });

  const categories = [...new Set(services.map((s) => s.category).filter(Boolean))];
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredServices = services.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  /**
   * @description 重置表单
   */
  function resetForm() {
    setForm({ name: "", description: "", unitPrice: "", unit: "次", category: "" });
    setEditingId(null);
    setShowForm(false);
  }

  /**
   * @description 编辑服务项目
   */
  function handleEdit(service: ServiceItem) {
    setForm({
      name: service.name,
      description: service.description,
      unitPrice: service.unitPrice.toString(),
      unit: service.unit,
      category: service.category,
    });
    setEditingId(service.id);
    setShowForm(true);
  }

  /**
   * @description 提交表单
   */
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.unitPrice) return;

    if (editingId) {
      updateService(editingId, {
        name: form.name,
        description: form.description,
        unitPrice: parseFloat(form.unitPrice),
        unit: form.unit,
        category: form.category,
      });
    } else {
      addService({
        id: uuidv4(),
        name: form.name,
        description: form.description,
        unitPrice: parseFloat(form.unitPrice),
        unit: form.unit,
        category: form.category,
        createdAt: new Date().toISOString(),
      });
    }
    resetForm();
  }

  return (
    <div className="px-4 pt-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text dark:text-text-dark">
          服务项目库
        </h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-dark"
        >
          <Plus size={18} />
          添加服务
        </button>
      </div>

      {services.length > 0 && (
        <>
          <div className="relative mb-4">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="搜索服务..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary dark:border-border-dark dark:bg-surface-dark dark:text-text-dark"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X size={16} className="text-text-muted" />
              </button>
            )}
          </div>

          {categories.length > 0 && (
            <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  !selectedCategory
                    ? "bg-primary text-white"
                    : "bg-surface text-text-muted border border-border dark:bg-surface-dark dark:border-border-dark"
                }`}
              >
                全部
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-primary text-white"
                      : "bg-surface text-text-muted border border-border dark:bg-surface-dark dark:border-border-dark"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 rounded-xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark"
        >
          <h3 className="mb-4 font-semibold text-text dark:text-text-dark">
            {editingId ? "编辑服务" : "添加服务"}
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="服务名称 *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-bg-dark dark:text-text-dark"
              required
            />
            <input
              type="text"
              placeholder="描述"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-bg-dark dark:text-text-dark"
            />
            <div className="grid grid-cols-3 gap-3">
              <input
                type="number"
                placeholder="单价 *"
                value={form.unitPrice}
                onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
                className="rounded-lg border border-border bg-bg px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-bg-dark dark:text-text-dark"
                min="0"
                step="0.01"
                required
              />
              <input
                type="text"
                placeholder="单位"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="rounded-lg border border-border bg-bg px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-bg-dark dark:text-text-dark"
              />
              <input
                type="text"
                placeholder="分类"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="rounded-lg border border-border bg-bg px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-bg-dark dark:text-text-dark"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
            >
              {editingId ? "更新" : "添加"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-border px-4 py-2.5 text-sm text-text-muted transition-colors hover:bg-bg dark:border-border-dark"
            >
              取消
            </button>
          </div>
        </form>
      )}

      {services.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="服务库为空"
          description="添加常用服务项目和单价，方便创建报价单时快速引用"
          action={
            <button
              onClick={() => setShowForm(true)}
              className="rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
            >
              添加第一个服务
            </button>
          }
        />
      ) : filteredServices.length === 0 ? (
        <p className="py-8 text-center text-sm text-text-muted dark:text-text-muted-dark">
          没有找到匹配的服务
        </p>
      ) : (
        <div className="space-y-3">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="rounded-xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark"
            >
              <div className="mb-1 flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-text dark:text-text-dark">
                      {service.name}
                    </h3>
                    {service.category && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        {service.category}
                      </span>
                    )}
                  </div>
                  {service.description && (
                    <p className="mt-1 text-sm text-text-muted dark:text-text-muted-dark">
                      {service.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(service)}
                    className="rounded-lg p-2 text-text-muted transition-colors hover:bg-bg dark:hover:bg-bg-dark"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => deleteService(service.id)}
                    className="rounded-lg p-2 text-danger transition-colors hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-lg font-bold text-primary">
                {formatCurrency(service.unitPrice, currency)}
                <span className="text-sm font-normal text-text-muted dark:text-text-muted-dark">
                  /{service.unit}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
