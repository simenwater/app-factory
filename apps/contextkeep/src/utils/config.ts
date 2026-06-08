/**
 * @module config
 * @description 配置管理工具。
 * 提供类型安全的配置读取接口。
 */

import * as vscode from 'vscode';

/** ContextKeep 配置项 */
export interface ContextKeepConfig {
  autoIndex: boolean;
  maxFileSize: number;
  excludePatterns: string[];
  indexLanguages: string[];
  maxMemoryItems: number;
  topKResults: number;
}

/**
 * 获取当前的 ContextKeep 配置
 * @returns 类型安全的配置对象
 */
export function getConfig(): ContextKeepConfig {
  const config = vscode.workspace.getConfiguration('contextkeep');
  return {
    autoIndex: config.get<boolean>('autoIndex') ?? true,
    maxFileSize: config.get<number>('maxFileSize') ?? 102400,
    excludePatterns: config.get<string[]>('excludePatterns') ?? [],
    indexLanguages: config.get<string[]>('indexLanguages') ?? [],
    maxMemoryItems: config.get<number>('maxMemoryItems') ?? 5000,
    topKResults: config.get<number>('topKResults') ?? 10,
  };
}

/**
 * 监听配置变更
 * @param callback - 配置变更回调
 * @returns 可销毁的监听器
 */
export function onConfigChange(
  callback: (config: ContextKeepConfig) => void
): vscode.Disposable {
  return vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration('contextkeep')) {
      callback(getConfig());
    }
  });
}
