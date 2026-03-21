"use client";

/**
 * @description 客户看板视图 — 拖拽管理客户状态
 */

import { useState } from "react";
import { Plus, Mail, Phone, Building2 } from "lucide-react";
import { useClientStore } from "@/store/clientStore";
import type { Client, ClientStatus } from "@/types";
import { CLIENT_COLUMNS } from "@/types";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { KanbanCard } from "@/components/kanban/KanbanCard";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ClientForm } from "./ClientForm";

/**
 * @description 客户看板
 */
export function ClientBoard() {
  const { clients, addClient, updateClient, moveClient } = useClientStore();
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>();

  const handleDragEnd = (itemId: string, newStatus: ClientStatus) => {
    moveClient(itemId, newStatus);
  };

  const handleSubmit = (data: Omit<Client, "id" | "createdAt" | "updatedAt">) => {
    if (editingClient) {
      updateClient(editingClient.id, data);
    } else {
      addClient(data);
    }
    setShowForm(false);
    setEditingClient(undefined);
  };

  const items = CLIENT_COLUMNS.reduce(
    (acc, col) => {
      acc[col.id] = clients
        .filter((c) => c.status === col.id)
        .map((client) => (
          <KanbanCard
            key={client.id}
            id={client.id}
            onClick={() => {
              setEditingClient(client);
              setShowForm(true);
            }}
          >
            <div className="space-y-2">
              <p className="font-medium text-text dark:text-text-dark">{client.name}</p>
              {client.company && (
                <div className="flex items-center gap-1.5 text-xs text-text-muted dark:text-text-muted-dark">
                  <Building2 className="h-3 w-3" />
                  {client.company}
                </div>
              )}
              {client.email && (
                <div className="flex items-center gap-1.5 text-xs text-text-muted dark:text-text-muted-dark">
                  <Mail className="h-3 w-3" />
                  {client.email}
                </div>
              )}
              {client.phone && (
                <div className="flex items-center gap-1.5 text-xs text-text-muted dark:text-text-muted-dark">
                  <Phone className="h-3 w-3" />
                  {client.phone}
                </div>
              )}
            </div>
          </KanbanCard>
        ));
      return acc;
    },
    {} as Record<ClientStatus, React.ReactNode[]>
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text dark:text-text-dark">客户管理</h1>
          <p className="text-sm text-text-muted dark:text-text-muted-dark">
            拖拽卡片管理客户状态
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4" />
          新增客户
        </Button>
      </div>

      <KanbanBoard
        columns={CLIENT_COLUMNS}
        items={items}
        onDragEnd={handleDragEnd}
      />

      <Modal
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingClient(undefined);
        }}
        title={editingClient ? "编辑客户" : "新增客户"}
      >
        <ClientForm
          client={editingClient}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingClient(undefined);
          }}
        />
      </Modal>
    </div>
  );
}
