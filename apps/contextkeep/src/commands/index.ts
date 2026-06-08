/**
 * @module commands
 * @description VS Code 命令处理器注册。
 * 将所有 ContextKeep 命令绑定到对应的处理函数。
 */

import * as vscode from 'vscode';
import { MemoryManager } from '../core/memoryManager';
import { SidebarProvider } from '../providers/sidebarProvider';
import { StatusBarManager } from '../providers/statusBar';

/**
 * 注册所有 ContextKeep 命令
 * @param context - 扩展上下文
 * @param memoryManager - 记忆管理器
 * @param sidebarProvider - 侧边栏提供者
 * @param statusBar - 状态栏管理器
 */
export function registerCommands(
  context: vscode.ExtensionContext,
  memoryManager: MemoryManager,
  sidebarProvider: SidebarProvider,
  statusBar: StatusBarManager
): void {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'contextkeep.indexProject',
      () => handleIndexProject(memoryManager, sidebarProvider, statusBar)
    ),

    vscode.commands.registerCommand(
      'contextkeep.searchMemory',
      () => handleSearchMemory(memoryManager)
    ),

    vscode.commands.registerCommand(
      'contextkeep.injectContext',
      () => handleInjectContext(memoryManager)
    ),

    vscode.commands.registerCommand(
      'contextkeep.clearMemory',
      () => handleClearMemory(memoryManager, sidebarProvider, statusBar)
    ),

    vscode.commands.registerCommand(
      'contextkeep.showStats',
      () => handleShowStats(memoryManager)
    ),

    vscode.commands.registerCommand(
      'contextkeep.addNote',
      () => handleAddNote(memoryManager, sidebarProvider, statusBar)
    ),

    vscode.commands.registerCommand(
      'contextkeep.manageSubscription',
      () => handleManageSubscription()
    ),

    vscode.commands.registerCommand(
      'contextkeep.refreshSidebar',
      () => sidebarProvider.refresh()
    )
  );
}

/**
 * 处理项目索引命令
 */
async function handleIndexProject(
  memoryManager: MemoryManager,
  sidebarProvider: SidebarProvider,
  statusBar: StatusBarManager
): Promise<void> {
  if (memoryManager.isIndexing) {
    vscode.window.showWarningMessage('ContextKeep: 索引正在进行中...');
    return;
  }

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'ContextKeep: 索引项目',
      cancellable: true,
    },
    async (progress, token) => {
      statusBar.update();
      try {
        const count = await memoryManager.indexWorkspace(
          (p) => {
            const pct = p.total > 0 ? (p.current / p.total) * 100 : 0;
            progress.report({
              increment: pct / p.total,
              message: `${p.current}/${p.total} - ${p.currentFile}`,
            });
            statusBar.update();
          },
          token
        );
        vscode.window.showInformationMessage(
          `ContextKeep: 索引完成，已处理 ${count} 个文件`
        );
      } catch (err) {
        vscode.window.showErrorMessage(
          `ContextKeep: 索引失败 - ${err instanceof Error ? err.message : String(err)}`
        );
      } finally {
        statusBar.update();
        sidebarProvider.refresh();
      }
    }
  );
}

/**
 * 处理搜索记忆命令
 */
async function handleSearchMemory(
  memoryManager: MemoryManager
): Promise<void> {
  const query = await vscode.window.showInputBox({
    prompt: '输入搜索关键词',
    placeHolder: '例如: 用户认证逻辑、API 路由...',
  });

  if (!query) {
    return;
  }

  const results = memoryManager.search(query);
  if (results.length === 0) {
    vscode.window.showInformationMessage('ContextKeep: 未找到相关记忆');
    return;
  }

  const items = results.map((r) => ({
    label: `$(${getTypeIcon(r.record.metadata.type)}) ${r.record.metadata.summary}`,
    description: `${(r.score * 100).toFixed(1)}% 匹配`,
    detail: r.record.metadata.filePath || r.record.metadata.type,
    result: r,
  }));

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: '选择一条记忆查看详情',
    matchOnDescription: true,
    matchOnDetail: true,
  });

  if (selected?.result.record.metadata.filePath) {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (workspaceFolder) {
      const fileUri = vscode.Uri.joinPath(
        workspaceFolder.uri,
        selected.result.record.metadata.filePath
      );
      try {
        const doc = await vscode.workspace.openTextDocument(fileUri);
        const editor = await vscode.window.showTextDocument(doc);
        const line = selected.result.record.metadata.lineRange?.start;
        if (line) {
          const pos = new vscode.Position(line - 1, 0);
          editor.selection = new vscode.Selection(pos, pos);
          editor.revealRange(
            new vscode.Range(pos, pos),
            vscode.TextEditorRevealType.InCenter
          );
        }
      } catch {
        // file may have been deleted
      }
    }
  }
}

/**
 * 处理上下文注入命令
 */
async function handleInjectContext(
  memoryManager: MemoryManager
): Promise<void> {
  const query = await vscode.window.showInputBox({
    prompt: '描述你当前的编码任务',
    placeHolder: '例如: 重构用户登录流程...',
  });

  if (!query) {
    return;
  }

  const context = memoryManager.generateContextInjection(query);
  await vscode.env.clipboard.writeText(context);
  vscode.window.showInformationMessage(
    'ContextKeep: 上下文已复制到剪贴板，可直接粘贴给 AI 助手'
  );
}

/**
 * 处理清除记忆命令
 */
async function handleClearMemory(
  memoryManager: MemoryManager,
  sidebarProvider: SidebarProvider,
  statusBar: StatusBarManager
): Promise<void> {
  const confirm = await vscode.window.showWarningMessage(
    'ContextKeep: 确定要清除所有项目记忆吗？此操作不可恢复。',
    { modal: true },
    '确认清除'
  );

  if (confirm === '确认清除') {
    await memoryManager.clearMemory();
    statusBar.update();
    sidebarProvider.refresh();
    vscode.window.showInformationMessage('ContextKeep: 记忆已清除');
  }
}

/**
 * 显示记忆统计信息
 */
async function handleShowStats(
  memoryManager: MemoryManager
): Promise<void> {
  const stats = memoryManager.getStats();
  const typeInfo = Object.entries(stats.typeDistribution)
    .map(([type, count]) => `  ${type}: ${count}`)
    .join('\n');
  const langInfo = Object.entries(stats.languageDistribution)
    .map(([lang, count]) => `  ${lang}: ${count}`)
    .join('\n');

  const message = [
    `📊 ContextKeep 统计`,
    ``,
    `项目 ID: ${stats.projectId}`,
    `记忆总数: ${stats.totalRecords}/${stats.maxRecords}`,
    `上次索引: ${stats.lastIndexTime ? new Date(stats.lastIndexTime).toLocaleString() : '未索引'}`,
    ``,
    `类型分布:`,
    typeInfo || '  (空)',
    ``,
    `语言分布:`,
    langInfo || '  (空)',
  ].join('\n');

  const action = await vscode.window.showInformationMessage(
    message,
    { modal: true },
    '索引项目',
    '清除记忆'
  );

  if (action === '索引项目') {
    vscode.commands.executeCommand('contextkeep.indexProject');
  } else if (action === '清除记忆') {
    vscode.commands.executeCommand('contextkeep.clearMemory');
  }
}

/**
 * 处理添加笔记命令（从编辑器选区）
 */
async function handleAddNote(
  memoryManager: MemoryManager,
  sidebarProvider: SidebarProvider,
  statusBar: StatusBarManager
): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  let initialContent = '';

  if (editor && !editor.selection.isEmpty) {
    initialContent = editor.document.getText(editor.selection);
  }

  const content = await vscode.window.showInputBox({
    prompt: '输入上下文笔记',
    placeHolder: '例如: 用户认证使用 JWT + refresh token 机制',
    value: initialContent,
  });

  if (!content) {
    return;
  }

  const tagsStr = await vscode.window.showInputBox({
    prompt: '标签（可选，逗号分隔）',
    placeHolder: '例如: auth, architecture',
  });

  const tags = tagsStr
    ? tagsStr.split(',').map((t) => t.trim()).filter(Boolean)
    : undefined;

  memoryManager.addNote(content, tags);
  statusBar.update();
  sidebarProvider.refresh();
  vscode.window.showInformationMessage('ContextKeep: 笔记已保存');
}

/**
 * 处理订阅管理命令
 */
async function handleManageSubscription(): Promise<void> {
  const choice = await vscode.window.showInformationMessage(
    '🌟 ContextKeep Pro — 云同步记忆与团队共享\n\n'
    + '免费版: 本地记忆（最多 5000 条）\n'
    + 'Pro 版: $5/月 — 无限记忆 + 云同步 + 团队共享',
    { modal: true },
    '升级到 Pro',
    '了解更多'
  );

  if (choice === '升级到 Pro') {
    vscode.env.openExternal(
      vscode.Uri.parse('https://contextkeep.dev/pricing')
    );
  } else if (choice === '了解更多') {
    vscode.env.openExternal(
      vscode.Uri.parse('https://contextkeep.dev')
    );
  }
}

/**
 * 获取记录类型对应的图标
 * @param type - 记录类型
 * @returns VS Code codicon 名称
 */
function getTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    file: 'file-code',
    snippet: 'code',
    note: 'note',
    decision: 'milestone',
    conversation: 'comment-discussion',
  };
  return icons[type] || 'circle';
}
