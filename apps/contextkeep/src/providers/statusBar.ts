/**
 * @module statusBar
 * @description VS Code 状态栏组件。
 * 显示 ContextKeep 的运行状态和记忆统计。
 */

import * as vscode from 'vscode';
import { MemoryManager } from '../core/memoryManager';

/**
 * 管理 VS Code 底部状态栏上的 ContextKeep 图标与信息。
 */
export class StatusBarManager {
  private statusBarItem: vscode.StatusBarItem;
  private memoryManager: MemoryManager;

  /**
   * @param memoryManager - 记忆管理器实例
   */
  constructor(memoryManager: MemoryManager) {
    this.memoryManager = memoryManager;
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100
    );
    this.statusBarItem.command = 'contextkeep.showStats';
    this.update();
    this.statusBarItem.show();
  }

  /** 更新状态栏显示内容 */
  update(): void {
    const stats = this.memoryManager.getStats();

    if (this.memoryManager.isIndexing) {
      this.statusBarItem.text = '$(sync~spin) ContextKeep: 索引中...';
      this.statusBarItem.tooltip = '正在索引项目文件';
    } else {
      this.statusBarItem.text = `$(brain) CK: ${stats.totalRecords}`;
      this.statusBarItem.tooltip = [
        `ContextKeep 记忆统计`,
        `━━━━━━━━━━━━━━━━━━`,
        `记忆条目: ${stats.totalRecords}/${stats.maxRecords}`,
        `项目 ID: ${stats.projectId}`,
        `上次索引: ${stats.lastIndexTime ? new Date(stats.lastIndexTime).toLocaleString() : '未索引'}`,
        ``,
        `类型分布:`,
        ...Object.entries(stats.typeDistribution).map(
          ([type, count]) => `  ${type}: ${count}`
        ),
        ``,
        `点击查看详细统计`,
      ].join('\n');
    }
  }

  /** 销毁状态栏项 */
  dispose(): void {
    this.statusBarItem.dispose();
  }
}
