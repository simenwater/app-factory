"use client";

/**
 * @description 客户表单组件 — 新增/编辑客户
 */

import { useState } from "react";
import type { Client, ClientStatus } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

interface ClientFormProps {
  client?: Client;
  onSubmit: (data: Omit<Client, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}

const STATUS_OPTIONS = [
  { value: "lead", label: "潜在客户" },
  { value: "active", label: "活跃客户" },
  { value: "completed", label: "已完成" },
  { value: "archived", label: "已归档" },
];

/**
 * @description 客户表单
 * @param {ClientFormProps} props
 */
export function ClientForm({ client, onSubmit, onCancel }: ClientFormProps) {
  const [name, setName] = useState(client?.name || "");
  const [email, setEmail] = useState(client?.email || "");
  const [phone, setPhone] = useState(client?.phone || "");
  const [company, setCompany] = useState(client?.company || "");
  const [status, setStatus] = useState<ClientStatus>(client?.status || "lead");
  const [notes, setNotes] = useState(client?.notes || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email, phone, company, status, notes });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="姓名"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="客户姓名"
      />
      <Input
        label="邮箱"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email@example.com"
      />
      <Input
        label="电话"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+1 234 567 8900"
      />
      <Input
        label="公司"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        placeholder="公司名称"
      />
      <Select
        label="状态"
        value={status}
        onChange={(e) => setStatus(e.target.value as ClientStatus)}
        options={STATUS_OPTIONS}
      />
      <div className="space-y-1">
        <label className="block text-sm font-medium text-text dark:text-text-dark">
          备注
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-border-dark dark:bg-surface-dark dark:text-text-dark dark:placeholder:text-text-muted-dark"
          placeholder="关于此客户的备注..."
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit">{client ? "更新" : "创建"}客户</Button>
      </div>
    </form>
  );
}
