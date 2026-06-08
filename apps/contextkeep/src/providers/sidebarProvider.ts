/**
 * @module sidebarProvider
 * @description VS Code 侧边栏 WebView 提供者。
 * 提供记忆搜索、统计展示和笔记管理界面。
 */

import * as vscode from 'vscode';
import { MemoryManager } from '../core/memoryManager';

/**
 * ContextKeep 侧边栏 WebView 提供者。
 * 渲染一个支持深色模式的现代化 Web 界面。
 */
export class SidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'contextkeep.sidebarView';
  private view?: vscode.WebviewView;

  /**
   * @param extensionUri - 扩展根目录 URI
   * @param memoryManager - 记忆管理器实例
   */
  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly memoryManager: MemoryManager
  ) {}

  /**
   * WebView 视图解析回调
   * @param webviewView - 待初始化的 WebView 视图
   */
  resolveWebviewView(webviewView: vscode.WebviewView): void {
    this.view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri],
    };

    webviewView.webview.html = this.getHtml();

    webviewView.webview.onDidReceiveMessage(async (message) => {
      switch (message.command) {
        case 'search':
          this.handleSearch(message.query);
          break;
        case 'addNote':
          this.handleAddNote(message.content, message.tags);
          break;
        case 'indexProject':
          vscode.commands.executeCommand('contextkeep.indexProject');
          break;
        case 'injectContext':
          this.handleInjectContext(message.query);
          break;
        case 'getStats':
          this.sendStats();
          break;
        case 'openFile':
          this.handleOpenFile(message.filePath, message.line);
          break;
      }
    });

    this.sendStats();
  }

  /** 刷新侧边栏内容 */
  refresh(): void {
    if (this.view) {
      this.sendStats();
    }
  }

  /**
   * 处理搜索请求
   * @param query - 搜索查询
   */
  private handleSearch(query: string): void {
    const results = this.memoryManager.search(query);
    this.view?.webview.postMessage({
      type: 'searchResults',
      results: results.map((r) => ({
        id: r.record.id,
        score: r.score,
        summary: r.record.metadata.summary,
        type: r.record.metadata.type,
        filePath: r.record.metadata.filePath,
        language: r.record.metadata.language,
        content: r.record.metadata.content?.slice(0, 300),
        lineRange: r.record.metadata.lineRange,
      })),
    });
  }

  /**
   * 处理添加笔记
   * @param content - 笔记内容
   * @param tags - 标签
   */
  private handleAddNote(content: string, tags?: string[]): void {
    this.memoryManager.addNote(content, tags);
    vscode.window.showInformationMessage('ContextKeep: 笔记已保存');
    this.sendStats();
  }

  /**
   * 处理上下文注入
   * @param query - 上下文查询
   */
  private handleInjectContext(query: string): void {
    const context = this.memoryManager.generateContextInjection(query);
    vscode.env.clipboard.writeText(context);
    vscode.window.showInformationMessage(
      'ContextKeep: 上下文已复制到剪贴板'
    );
  }

  /**
   * 处理打开文件请求
   * @param filePath - 文件路径
   * @param line - 行号
   */
  private async handleOpenFile(
    filePath: string,
    line?: number
  ): Promise<void> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder || !filePath) {
      return;
    }
    const fileUri = vscode.Uri.joinPath(workspaceFolder.uri, filePath);
    try {
      const doc = await vscode.workspace.openTextDocument(fileUri);
      const editor = await vscode.window.showTextDocument(doc);
      if (line) {
        const position = new vscode.Position(line - 1, 0);
        editor.selection = new vscode.Selection(position, position);
        editor.revealRange(
          new vscode.Range(position, position),
          vscode.TextEditorRevealType.InCenter
        );
      }
    } catch {
      vscode.window.showWarningMessage(`无法打开文件: ${filePath}`);
    }
  }

  /** 向 WebView 发送统计数据 */
  private sendStats(): void {
    const stats = this.memoryManager.getStats();
    this.view?.webview.postMessage({ type: 'stats', stats });
  }

  /**
   * 生成 WebView HTML 内容
   * @returns 完整的 HTML 字符串
   */
  private getHtml(): string {
    return /*html*/ `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    :root {
      --bg: var(--vscode-sideBar-background);
      --fg: var(--vscode-sideBar-foreground);
      --input-bg: var(--vscode-input-background);
      --input-fg: var(--vscode-input-foreground);
      --input-border: var(--vscode-input-border);
      --btn-bg: var(--vscode-button-background);
      --btn-fg: var(--vscode-button-foreground);
      --btn-hover: var(--vscode-button-hoverBackground);
      --badge-bg: var(--vscode-badge-background);
      --badge-fg: var(--vscode-badge-foreground);
      --border: var(--vscode-panel-border);
      --link: var(--vscode-textLink-foreground);
      --code-bg: var(--vscode-textCodeBlock-background);
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
      color: var(--fg);
      background: var(--bg);
      padding: 12px;
      line-height: 1.5;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--border);
    }

    .header h2 {
      font-size: 14px;
      font-weight: 600;
      flex: 1;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 16px;
    }

    .stat-card {
      background: var(--input-bg);
      border-radius: 6px;
      padding: 10px;
      text-align: center;
    }

    .stat-card .value {
      font-size: 20px;
      font-weight: 700;
      color: var(--link);
    }

    .stat-card .label {
      font-size: 11px;
      opacity: 0.7;
      margin-top: 2px;
    }

    .section { margin-bottom: 16px; }

    .section-title {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      opacity: 0.7;
      margin-bottom: 8px;
    }

    .search-box {
      display: flex;
      gap: 4px;
    }

    input, textarea {
      background: var(--input-bg);
      color: var(--input-fg);
      border: 1px solid var(--input-border);
      border-radius: 4px;
      padding: 6px 10px;
      font-size: 13px;
      font-family: inherit;
      width: 100%;
      outline: none;
    }

    input:focus, textarea:focus {
      border-color: var(--link);
    }

    textarea {
      resize: vertical;
      min-height: 60px;
    }

    button {
      background: var(--btn-bg);
      color: var(--btn-fg);
      border: none;
      border-radius: 4px;
      padding: 6px 12px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
      transition: background 0.15s;
    }

    button:hover { background: var(--btn-hover); }

    .btn-secondary {
      background: var(--input-bg);
      color: var(--fg);
      border: 1px solid var(--border);
    }

    .btn-block {
      width: 100%;
      margin-top: 8px;
    }

    .results {
      max-height: 400px;
      overflow-y: auto;
    }

    .result-item {
      background: var(--input-bg);
      border-radius: 6px;
      padding: 10px;
      margin-bottom: 8px;
      cursor: pointer;
      transition: opacity 0.15s;
    }

    .result-item:hover { opacity: 0.85; }

    .result-header {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 4px;
    }

    .result-badge {
      background: var(--badge-bg);
      color: var(--badge-fg);
      font-size: 10px;
      padding: 1px 6px;
      border-radius: 10px;
      font-weight: 600;
    }

    .result-score {
      font-size: 11px;
      opacity: 0.6;
      margin-left: auto;
    }

    .result-path {
      font-size: 11px;
      color: var(--link);
      word-break: break-all;
    }

    .result-preview {
      font-size: 12px;
      opacity: 0.8;
      margin-top: 4px;
      background: var(--code-bg);
      padding: 6px;
      border-radius: 3px;
      font-family: var(--vscode-editor-font-family);
      white-space: pre-wrap;
      word-break: break-all;
      max-height: 80px;
      overflow: hidden;
    }

    .empty-state {
      text-align: center;
      padding: 24px 12px;
      opacity: 0.6;
    }

    .empty-state .icon { font-size: 32px; margin-bottom: 8px; }

    .note-form { display: flex; flex-direction: column; gap: 8px; }

    .tabs {
      display: flex;
      border-bottom: 1px solid var(--border);
      margin-bottom: 12px;
    }

    .tab {
      padding: 6px 12px;
      font-size: 12px;
      cursor: pointer;
      opacity: 0.6;
      border-bottom: 2px solid transparent;
      transition: all 0.15s;
      background: none;
      color: var(--fg);
      border-radius: 0;
    }

    .tab:hover { opacity: 0.8; }
    .tab.active {
      opacity: 1;
      border-bottom-color: var(--link);
    }

    .tab-content { display: none; }
    .tab-content.active { display: block; }
  </style>
</head>
<body>
  <div class="header">
    <h2>🧠 ContextKeep</h2>
  </div>

  <div class="stats-grid" id="statsGrid">
    <div class="stat-card">
      <div class="value" id="totalMemories">0</div>
      <div class="label">记忆条目</div>
    </div>
    <div class="stat-card">
      <div class="value" id="lastIndexed">-</div>
      <div class="label">上次索引</div>
    </div>
  </div>

  <div class="tabs">
    <div class="tab active" data-tab="search">搜索</div>
    <div class="tab" data-tab="inject">注入</div>
    <div class="tab" data-tab="notes">笔记</div>
  </div>

  <div class="tab-content active" id="tab-search">
    <div class="section">
      <div class="search-box">
        <input type="text" id="searchInput" placeholder="搜索项目记忆..." />
        <button id="searchBtn">搜索</button>
      </div>
    </div>
    <div class="results" id="searchResults">
      <div class="empty-state">
        <div class="icon">🔍</div>
        <p>输入关键词搜索项目记忆</p>
      </div>
    </div>
  </div>

  <div class="tab-content" id="tab-inject">
    <div class="section">
      <p style="font-size: 12px; opacity: 0.7; margin-bottom: 8px;">
        输入当前任务描述，生成上下文摘要并复制到剪贴板，
        可直接粘贴给 AI 助手使用。
      </p>
      <textarea id="injectQuery" placeholder="描述你当前的编码任务..."></textarea>
      <button class="btn-block" id="injectBtn">📋 生成并复制上下文</button>
    </div>
  </div>

  <div class="tab-content" id="tab-notes">
    <div class="section">
      <div class="note-form">
        <textarea id="noteContent" placeholder="记录架构决策、重要约定..."></textarea>
        <input type="text" id="noteTags" placeholder="标签（逗号分隔）" />
        <button class="btn-block" id="addNoteBtn">💾 保存笔记</button>
      </div>
    </div>
  </div>

  <div class="section" style="margin-top: 12px;">
    <button class="btn-block btn-secondary" id="indexBtn">🔄 索引当前项目</button>
  </div>

  <script>
    const vscode = acquireVsCodeApi();

    // Tab switching
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
      });
    });

    // Search
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    searchBtn.addEventListener('click', () => {
      const query = searchInput.value.trim();
      if (query) vscode.postMessage({ command: 'search', query });
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') searchBtn.click();
    });

    // Inject context
    document.getElementById('injectBtn').addEventListener('click', () => {
      const query = document.getElementById('injectQuery').value.trim();
      if (query) vscode.postMessage({ command: 'injectContext', query });
    });

    // Add note
    document.getElementById('addNoteBtn').addEventListener('click', () => {
      const content = document.getElementById('noteContent').value.trim();
      const tagsStr = document.getElementById('noteTags').value.trim();
      if (content) {
        const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : undefined;
        vscode.postMessage({ command: 'addNote', content, tags });
        document.getElementById('noteContent').value = '';
        document.getElementById('noteTags').value = '';
      }
    });

    // Index project
    document.getElementById('indexBtn').addEventListener('click', () => {
      vscode.postMessage({ command: 'indexProject' });
    });

    // Handle messages from extension
    window.addEventListener('message', (event) => {
      const msg = event.data;

      if (msg.type === 'stats') {
        document.getElementById('totalMemories').textContent = msg.stats.totalRecords || 0;
        const lastIndex = msg.stats.lastIndexTime;
        document.getElementById('lastIndexed').textContent = lastIndex
          ? new Date(lastIndex).toLocaleDateString()
          : '-';
      }

      if (msg.type === 'searchResults') {
        const container = document.getElementById('searchResults');
        if (msg.results.length === 0) {
          container.innerHTML = '<div class="empty-state"><div class="icon">🤷</div><p>未找到相关记忆</p></div>';
          return;
        }
        container.innerHTML = msg.results.map(r => {
          const preview = r.content ? r.content.replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';
          return '<div class="result-item" data-file="' + (r.filePath || '') + '" data-line="' + (r.lineRange?.start || '') + '">'
            + '<div class="result-header">'
            + '<span class="result-badge">' + r.type + '</span>'
            + (r.filePath ? '<span class="result-path">' + r.filePath + '</span>' : '')
            + '<span class="result-score">' + (r.score * 100).toFixed(1) + '%</span>'
            + '</div>'
            + (preview ? '<div class="result-preview">' + preview + '</div>' : '')
            + '</div>';
        }).join('');

        container.querySelectorAll('.result-item').forEach(item => {
          item.addEventListener('click', () => {
            const file = item.dataset.file;
            const line = item.dataset.line;
            if (file) {
              vscode.postMessage({ command: 'openFile', filePath: file, line: line ? parseInt(line) : undefined });
            }
          });
        });
      }
    });

    // Request initial stats
    vscode.postMessage({ command: 'getStats' });
  </script>
</body>
</html>`;
  }
}
