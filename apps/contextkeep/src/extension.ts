/**
 * @module extension
 * @description ContextKeep VS Code 扩展入口点。
 * 注册所有组件、命令和事件监听器。
 */

import * as vscode from 'vscode';
import { MemoryManager } from './core/memoryManager';
import { SidebarProvider } from './providers/sidebarProvider';
import { StatusBarManager } from './providers/statusBar';
import { FileWatcher } from './utils/fileWatcher';
import { SubscriptionManager } from './subscription/subscriptionManager';
import { registerCommands } from './commands';

let memoryManager: MemoryManager;
let statusBar: StatusBarManager;
let fileWatcher: FileWatcher;
let subscriptionManager: SubscriptionManager;

/**
 * 扩展激活入口
 * @param context - VS Code 扩展上下文
 */
export async function activate(
  context: vscode.ExtensionContext
): Promise<void> {
  memoryManager = new MemoryManager();
  await memoryManager.initialize(context);

  subscriptionManager = new SubscriptionManager();
  await subscriptionManager.initialize(context);

  const sidebarProvider = new SidebarProvider(
    context.extensionUri,
    memoryManager
  );
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      SidebarProvider.viewType,
      sidebarProvider
    )
  );

  statusBar = new StatusBarManager(memoryManager);
  context.subscriptions.push({ dispose: () => statusBar.dispose() });

  registerCommands(
    context,
    memoryManager,
    sidebarProvider,
    statusBar
  );

  fileWatcher = new FileWatcher(memoryManager);
  fileWatcher.start(context);
  context.subscriptions.push({ dispose: () => fileWatcher.dispose() });

  const autoIndex = vscode.workspace
    .getConfiguration('contextkeep')
    .get<boolean>('autoIndex');
  if (autoIndex && memoryManager.getStats().totalRecords === 0) {
    const action = await vscode.window.showInformationMessage(
      'ContextKeep: 检测到新项目，是否立即索引？',
      '开始索引',
      '稍后'
    );
    if (action === '开始索引') {
      vscode.commands.executeCommand('contextkeep.indexProject');
    }
  }
}

/**
 * 扩展停用时触发
 */
export async function deactivate(): Promise<void> {
  if (memoryManager) {
    await memoryManager.forceSave();
  }
}
