"use client";

/**
 * @description 项目表单组件 — 新增/编辑项目
 */

import { useState } from "react";
import type { Project, ProjectStatus } from "@/types";
import { useClientStore } from "@/store/clientStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: Omit<Project, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}

const STATUS_OPTIONS = [
  { value: "inquiry", label: "咨询中" },
  { value: "quoted", label: "已报价" },
  { value: "in_progress", label: "进行中" },
  { value: "review", label: "审核中" },
  { value: "completed", label: "已完成" },
  { value: "cancelled", label: "已取消" },
];

/**
 * @description 项目表单
 * @param {ProjectFormProps} props
 */
export function ProjectForm({ project, onSubmit, onCancel }: ProjectFormProps) {
  const { clients } = useClientStore();
  const [clientId, setClientId] = useState(project?.clientId || "");
  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");
  const [status, setStatus] = useState<ProjectStatus>(project?.status || "inquiry");
  const [budget, setBudget] = useState(project?.budget?.toString() || "");
  const [deadline, setDeadline] = useState(project?.deadline || "");
  const [tagsStr, setTagsStr] = useState(project?.tags?.join(", ") || "");

  const clientOptions = [
    { value: "", label: "选择客户" },
    ...clients.map((c) => ({ value: c.id, label: c.name })),
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      clientId,
      name,
      description,
      status,
      budget: parseFloat(budget) || 0,
      deadline,
      tags: tagsStr
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="客户"
        value={clientId}
        onChange={(e) => setClientId(e.target.value)}
        options={clientOptions}
      />
      <Input
        label="项目名称"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="项目名称"
      />
      <div className="space-y-1">
        <label className="block text-sm font-medium text-text dark:text-text-dark">
          描述
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-border-dark dark:bg-surface-dark dark:text-text-dark dark:placeholder:text-text-muted-dark"
          placeholder="项目描述..."
        />
      </div>
      <Select
        label="状态"
        value={status}
        onChange={(e) => setStatus(e.target.value as ProjectStatus)}
        options={STATUS_OPTIONS}
      />
      <Input
        label="预算 ($)"
        type="number"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        placeholder="5000"
        min="0"
        step="100"
      />
      <Input
        label="截止日期"
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />
      <Input
        label="标签（逗号分隔）"
        value={tagsStr}
        onChange={(e) => setTagsStr(e.target.value)}
        placeholder="设计, 开发, 前端"
      />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit">{project ? "更新" : "创建"}项目</Button>
      </div>
    </form>
  );
}
