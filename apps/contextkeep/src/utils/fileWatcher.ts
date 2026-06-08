/**
 * @module fileWatcher
 * @description 文件变更监听器。
 * 监听工作区文件的增删改事件，触发增量索引。
 */

import * as vscode from 'vscode';
import { MemoryManager } from '../core/memoryManager';

/**
 * 工作区文件变更监听器。
 * 当文件被修改或创建时，自动触发增量索引。
 */
export class FileWatcher {
  private watcher: vscode.FileSystemWatcher | null = null;
  private debounceTimers = new Map<string, NodeJS.Timeout>();
  private readonly debounceMs = 2000;

  /**
   * @param memoryManager - 记忆管理器实例
   */
  constructor(private readonly memoryManager: MemoryManager) {}

  /**
   * 启动文件监听
   * @param context - 扩展上下文（用于注册 disposable）
   */
  start(context: vscode.ExtensionContext): void {
    const config = vscode.workspace.getConfiguration('contextkeep');
    const autoIndex = config.get<boolean>('autoIndex');

    if (!autoIndex) {
      return;
    }

    this.watcher = vscode.workspace.createFileSystemWatcher('**/*');

    this.watcher.onDidChange((uri) => this.onFileChange(uri));
    this.watcher.onDidCreate((uri) => this.onFileChange(uri));
    this.watcher.onDidDelete((uri) => this.onFileDelete(uri));

    context.subscriptions.push(this.watcher);
  }

  /**
   * 文件变更处理（防抖）
   * @param uri - 变更文件的 URI
   */
  private onFileChange(uri: vscode.Uri): void {
    if (this.shouldIgnore(uri)) {
      return;
    }

    const key = uri.fsPath;
    const existing = this.debounceTimers.get(key);
    if (existing) {
      clearTimeout(existing);
    }

    this.debounceTimers.set(
      key,
      setTimeout(() => {
        this.debounceTimers.delete(key);
        this.memoryManager.indexFile(uri).catch(() => {});
      }, this.debounceMs)
    );
  }

  /**
   * 文件删除处理
   * @param _uri - 被删除文件的 URI（暂不处理删除事件的清理）
   */
  private onFileDelete(_uri: vscode.Uri): void {
    // 暂不自动清理已删除文件的记忆，等待下次全量索引时清理
  }

  /**
   * 判断是否应忽略此文件
   * @param uri - 文件 URI
   * @returns 是否应忽略
   */
  private shouldIgnore(uri: vscode.Uri): boolean {
    const path = uri.fsPath;
    const ignorePatterns = [
      'node_modules',
      '.git',
      'dist',
      'build',
      '.next',
      'coverage',
      '__pycache__',
      '.venv',
      '.contextkeep.json',
    ];
    return ignorePatterns.some((p) => path.includes(p));
  }

  /** 停止文件监听 */
  dispose(): void {
    for (const timer of this.debounceTimers.values()) {
      clearTimeout(timer);
    }
    this.debounceTimers.clear();
    this.watcher?.dispose();
  }
}
