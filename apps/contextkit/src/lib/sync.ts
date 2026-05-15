/**
 * @fileoverview 云端同步模拟模块（MVP 演示用）
 *
 * 在 MVP 阶段使用 localStorage 模拟云端同步行为，
 * 后续可替换为真实的 API 调用。
 */

import { Device, Project, SyncStatus } from "@/types";
import { v4 as uuidv4 } from "uuid";

const SYNC_STORAGE_KEY = "contextkit_sync_data";
const DEVICES_STORAGE_KEY = "contextkit_devices";

/**
 * 获取当前设备信息，不存在则创建
 * @returns 当前设备对象
 */
export function getCurrentDevice(): Device {
  if (typeof window === "undefined") {
    return {
      id: "server",
      name: "Server",
      type: "desktop",
      os: "linux",
      lastActiveAt: new Date().toISOString(),
      isCurrent: true,
    };
  }

  const stored = localStorage.getItem("contextkit_current_device");
  if (stored) {
    const device: Device = JSON.parse(stored);
    device.lastActiveAt = new Date().toISOString();
    device.isCurrent = true;
    localStorage.setItem("contextkit_current_device", JSON.stringify(device));
    return device;
  }

  const newDevice: Device = {
    id: uuidv4(),
    name: detectDeviceName(),
    type: detectDeviceType(),
    os: detectOS(),
    lastActiveAt: new Date().toISOString(),
    isCurrent: true,
  };

  localStorage.setItem("contextkit_current_device", JSON.stringify(newDevice));
  addDeviceToList(newDevice);
  return newDevice;
}

/**
 * 获取已注册设备列表
 * @returns 设备列表
 */
export function getDevices(): Device[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(DEVICES_STORAGE_KEY);
  if (!stored) return [];
  return JSON.parse(stored);
}

/**
 * 将设备添加到设备列表
 * @param device - 设备对象
 */
function addDeviceToList(device: Device): void {
  const devices = getDevices();
  const exists = devices.find((d) => d.id === device.id);
  if (!exists) {
    devices.push(device);
    localStorage.setItem(DEVICES_STORAGE_KEY, JSON.stringify(devices));
  }
}

/**
 * 模拟同步项目到云端
 * @param projects - 项目列表
 * @returns 同步后的项目列表（带更新的同步状态）
 */
export async function syncProjects(projects: Project[]): Promise<Project[]> {
  await simulateNetworkDelay();

  const synced = projects.map((project) => ({
    ...project,
    syncStatus: "synced" as SyncStatus,
    lastSyncedAt: new Date().toISOString(),
  }));

  if (typeof window !== "undefined") {
    localStorage.setItem(SYNC_STORAGE_KEY, JSON.stringify(synced));
  }

  return synced;
}

/**
 * 模拟从云端拉取项目
 * @returns 云端项目列表
 */
export async function pullFromCloud(): Promise<Project[]> {
  await simulateNetworkDelay();

  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(SYNC_STORAGE_KEY);
  if (!stored) return [];
  return JSON.parse(stored);
}

/**
 * 模拟网络延迟
 * @param ms - 延迟毫秒数
 */
function simulateNetworkDelay(ms: number = 800): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 检测设备名称
 * @returns 设备名称字符串
 */
function detectDeviceName(): string {
  if (typeof navigator === "undefined") return "Unknown Device";
  const ua = navigator.userAgent;
  if (ua.includes("Mac")) return "MacBook";
  if (ua.includes("Windows")) return "Windows PC";
  if (ua.includes("Linux")) return "Linux Desktop";
  if (ua.includes("iPhone")) return "iPhone";
  if (ua.includes("iPad")) return "iPad";
  if (ua.includes("Android")) return "Android Device";
  return "Unknown Device";
}

/**
 * 检测设备类型
 * @returns 设备类型
 */
function detectDeviceType(): Device["type"] {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent;
  if (ua.includes("Mobile") || ua.includes("iPhone")) return "mobile";
  if (ua.includes("iPad") || ua.includes("Tablet")) return "tablet";
  if (ua.includes("Laptop") || ua.includes("MacBook")) return "laptop";
  return "desktop";
}

/**
 * 检测操作系统
 * @returns 操作系统名称
 */
function detectOS(): string {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (ua.includes("Mac OS")) return "macOS";
  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Linux")) return "Linux";
  if (ua.includes("iOS")) return "iOS";
  if (ua.includes("Android")) return "Android";
  return "Unknown";
}

/**
 * 移除设备
 * @param deviceId - 要移除的设备 ID
 */
export function removeDevice(deviceId: string): void {
  if (typeof window === "undefined") return;
  const devices = getDevices().filter((d) => d.id !== deviceId);
  localStorage.setItem(DEVICES_STORAGE_KEY, JSON.stringify(devices));
}
