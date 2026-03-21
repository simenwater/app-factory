/**
 * @description 客户状态管理 Store
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Client, ClientStatus } from "@/types";

/** @description 客户 Store 接口 */
interface ClientStore {
  clients: Client[];
  addClient: (client: Omit<Client, "id" | "createdAt" | "updatedAt">) => Client;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  moveClient: (id: string, status: ClientStatus) => void;
  getClientById: (id: string) => Client | undefined;
  getClientsByStatus: (status: ClientStatus) => Client[];
}

export const useClientStore = create<ClientStore>()(
  persist(
    (set, get) => ({
      clients: [],

      addClient: (data) => {
        const now = new Date().toISOString();
        const client: Client = {
          ...data,
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ clients: [...state.clients, client] }));
        return client;
      },

      updateClient: (id, data) => {
        set((state) => ({
          clients: state.clients.map((c) =>
            c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c
          ),
        }));
      },

      deleteClient: (id) => {
        set((state) => ({ clients: state.clients.filter((c) => c.id !== id) }));
      },

      moveClient: (id, status) => {
        set((state) => ({
          clients: state.clients.map((c) =>
            c.id === id ? { ...c, status, updatedAt: new Date().toISOString() } : c
          ),
        }));
      },

      getClientById: (id) => {
        return get().clients.find((c) => c.id === id);
      },

      getClientsByStatus: (status) => {
        return get().clients.filter((c) => c.status === status);
      },
    }),
    { name: "soloflow-clients" }
  )
);
