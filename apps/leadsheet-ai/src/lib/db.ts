/**
 * @fileoverview IndexedDB 离线存储层
 * 使用 idb 库管理乐谱的本地持久化存储。
 */

import type { LeadSheet } from "@/types";

/** DB 名称与版本 */
const DB_NAME = "leadsheet-ai";
const DB_VERSION = 1;
const STORE_NAME = "sheets";

/**
 * @description 动态加载 idb（SSR 安全）
 */
async function getDB() {
  const { openDB } = await import("idb");
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("by-title", "title");
        store.createIndex("by-date", "createdAt");
        store.createIndex("by-style", "style");
        store.createIndex("by-favorite", "isFavorite");
      }
    },
  });
}

/**
 * @description 保存乐谱到本地数据库
 * @param {LeadSheet} sheet - 要保存的乐谱
 */
export async function saveSheet(sheet: LeadSheet): Promise<void> {
  const db = await getDB();
  await db.put(STORE_NAME, sheet);
}

/**
 * @description 获取所有已保存的乐谱
 * @returns {Promise<LeadSheet[]>} 乐谱数组
 */
export async function getAllSheets(): Promise<LeadSheet[]> {
  const db = await getDB();
  return db.getAll(STORE_NAME);
}

/**
 * @description 根据 ID 获取单个乐谱
 * @param {string} id - 乐谱 ID
 * @returns {Promise<LeadSheet | undefined>} 乐谱对象
 */
export async function getSheetById(id: string): Promise<LeadSheet | undefined> {
  const db = await getDB();
  return db.get(STORE_NAME, id);
}

/**
 * @description 删除乐谱
 * @param {string} id - 乐谱 ID
 */
export async function deleteSheet(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}

/**
 * @description 切换收藏状态
 * @param {string} id - 乐谱 ID
 * @returns {Promise<boolean>} 新的收藏状态
 */
export async function toggleFavorite(id: string): Promise<boolean> {
  const db = await getDB();
  const sheet = await db.get(STORE_NAME, id);
  if (!sheet) return false;

  sheet.isFavorite = !sheet.isFavorite;
  sheet.updatedAt = new Date().toISOString();
  await db.put(STORE_NAME, sheet);
  return sheet.isFavorite;
}

/**
 * @description 搜索乐谱（按标题模糊匹配）
 * @param {string} query - 搜索关键词
 * @returns {Promise<LeadSheet[]>} 匹配的乐谱数组
 */
export async function searchSheets(query: string): Promise<LeadSheet[]> {
  const db = await getDB();
  const all = await db.getAll(STORE_NAME);
  const lower = query.toLowerCase();
  return all.filter(
    (s: LeadSheet) =>
      s.title.toLowerCase().includes(lower) ||
      s.composer.toLowerCase().includes(lower) ||
      s.tags.some((tag: string) => tag.toLowerCase().includes(lower))
  );
}

/**
 * @description 导出所有乐谱为 JSON
 * @returns {Promise<string>} JSON 字符串
 */
export async function exportAllAsJson(): Promise<string> {
  const sheets = await getAllSheets();
  return JSON.stringify(sheets, null, 2);
}

/**
 * @description 从 JSON 导入乐谱
 * @param {string} json - JSON 字符串
 * @returns {Promise<number>} 导入数量
 */
export async function importFromJson(json: string): Promise<number> {
  const sheets: LeadSheet[] = JSON.parse(json);
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  for (const sheet of sheets) {
    await tx.store.put(sheet);
  }
  await tx.done;
  return sheets.length;
}
