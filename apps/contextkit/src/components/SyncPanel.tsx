"use client";

import { useState, useEffect } from "react";
import {
  Cloud,
  RefreshCw,
  Monitor,
  Laptop,
  Smartphone,
  Tablet,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { syncProjects, getCurrentDevice, getDevices, removeDevice } from "@/lib/sync";
import { Device, SyncStatus } from "@/types";

/**
 * 获取同步状态的显示信息
 * @param status - 同步状态
 * @returns 图标、颜色、标签
 */
function getSyncStatusInfo(status: SyncStatus) {
  switch (status) {
    case "synced":
      return { icon: CheckCircle, color: "var(--success)", label: "已同步" };
    case "pending":
      return { icon: Clock, color: "var(--warning)", label: "待同步" };
    case "conflict":
      return { icon: AlertTriangle, color: "var(--danger)", label: "冲突" };
    case "local-only":
      return { icon: Monitor, color: "var(--text-muted)", label: "仅本地" };
  }
}

/**
 * 获取设备类型对应的图标
 * @param type - 设备类型
 * @returns Lucide 图标组件
 */
function getDeviceIcon(type: Device["type"]) {
  switch (type) {
    case "desktop": return Monitor;
    case "laptop": return Laptop;
    case "mobile": return Smartphone;
    case "tablet": return Tablet;
  }
}

/**
 * 同步管理面板
 * @returns SyncPanel 组件
 */
export default function SyncPanel() {
  const { projects, updateProject, isSyncing, setSyncing, subscription } = useStore();
  const [devices, setDevices] = useState<Device[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  useEffect(() => {
    getCurrentDevice();
    setDevices(getDevices());
  }, []);

  /**
   * 执行同步操作
   */
  const handleSync = async () => {
    if (!subscription.cloudSync) return;
    setSyncing(true);
    try {
      const synced = await syncProjects(projects);
      synced.forEach((p) => {
        updateProject(p.id, { syncStatus: p.syncStatus, lastSyncedAt: p.lastSyncedAt });
      });
      setLastSyncTime(new Date().toLocaleTimeString("zh-CN"));
    } finally {
      setSyncing(false);
    }
  };

  /**
   * 删除设备
   */
  const handleRemoveDevice = (deviceId: string) => {
    removeDevice(deviceId);
    setDevices(getDevices());
  };

  const pendingCount = projects.filter((p) => p.syncStatus === "pending" || p.syncStatus === "local-only").length;

  return (
    <div className="space-y-6">
      {/* 同步状态卡片 */}
      <div
        className="rounded-xl border p-6"
        style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-color)" }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl" style={{ backgroundColor: "var(--accent-light)" }}>
              <Cloud size={22} style={{ color: "var(--accent)" }} />
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>云端同步</h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {subscription.cloudSync
                  ? `${pendingCount} 个项目待同步`
                  : "升级到 Pro 方案解锁云端同步"}
              </p>
            </div>
          </div>

          <button
            onClick={handleSync}
            disabled={!subscription.cloudSync || isSyncing}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <RefreshCw size={14} className={isSyncing ? "animate-spin-slow" : ""} />
            {isSyncing ? "同步中..." : "立即同步"}
          </button>
        </div>

        {lastSyncTime && (
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            上次同步：{lastSyncTime}
          </p>
        )}

        {/* 项目同步状态列表 */}
        <div className="mt-4 space-y-2">
          {projects.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>
              暂无项目，去模板库创建你的第一个项目吧
            </p>
          ) : (
            projects.map((project) => {
              const statusInfo = getSyncStatusInfo(project.syncStatus);
              const StatusIcon = statusInfo.icon;
              return (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ backgroundColor: "var(--bg-secondary)" }}
                >
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      {project.name}
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      更新于 {new Date(project.updatedAt).toLocaleDateString("zh-CN")}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <StatusIcon size={14} style={{ color: statusInfo.color }} />
                    <span className="text-xs font-medium" style={{ color: statusInfo.color }}>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 设备管理 */}
      <div
        className="rounded-xl border p-6"
        style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-color)" }}
      >
        <h3 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          已连接设备
        </h3>

        {devices.length === 0 ? (
          <p className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>
            暂无已连接设备
          </p>
        ) : (
          <div className="space-y-3">
            {devices.map((device) => {
              const DeviceIcon = getDeviceIcon(device.type);
              return (
                <div
                  key={device.id}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ backgroundColor: "var(--bg-secondary)" }}
                >
                  <div className="flex items-center gap-3">
                    <DeviceIcon size={20} style={{ color: "var(--text-secondary)" }} />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                          {device.name}
                        </p>
                        {device.isCurrent && (
                          <span
                            className="text-xs px-1.5 py-0.5 rounded-full"
                            style={{
                              backgroundColor: "color-mix(in srgb, var(--success) 15%, transparent)",
                              color: "var(--success)",
                            }}
                          >
                            当前
                          </span>
                        )}
                      </div>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {device.os} · 最后活跃 {new Date(device.lastActiveAt).toLocaleDateString("zh-CN")}
                      </p>
                    </div>
                  </div>

                  {!device.isCurrent && (
                    <button
                      onClick={() => handleRemoveDevice(device.id)}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
