/**
 * @module memoryManager
 * @description 跨会话记忆管理器。
 * 负责记忆的持久化存储、加载、检索与注入。
 */

import * as vscode from 'vscode';
import * as path from 'path';
import { TextEmbedder, EmbedderState } from './embeddings';
import {
  VectorStore,
  VectorStoreState,
  SearchResult,
  RecordMetadata,
  StoreStats,
} from './vectorStore';
import { ProjectIndexer, IndexProgress } from './indexer';

/** 记忆管理器持久化状态 */
interface PersistedState {
  embedder: EmbedderState;
  store: VectorStoreState;
  lastIndexTime: number;
  projectId: string;
}

/**
 * 跨会话记忆管理器。
 * 整合嵌入引擎、向量存储和索引器，提供完整的记忆持久化方案。
 */
export class MemoryManager {
  private embedder: TextEmbedder;
  private store: VectorStore;
  private indexer: ProjectIndexer;
  private storageUri: vscode.Uri | null = null;
  private projectId = '';
  private lastIndexTime = 0;
  private saveDebounceTimer: NodeJS.Timeout | null = null;
  private noteCounter = 0;

  constructor() {
    this.embedder = new TextEmbedder();
    const maxItems =
      vscode.workspace
        .getConfiguration('contextkeep')
        .get<number>('maxMemoryItems') || 5000;
    this.store = new VectorStore(maxItems);
    this.indexer = new ProjectIndexer(this.embedder, this.store);
  }

  /**
   * 初始化记忆管理器
   * @param context - VS Code 扩展上下文
   */
  async initialize(context: vscode.ExtensionContext): Promise<void> {
    this.storageUri = context.globalStorageUri;
    await vscode.workspace.fs.createDirectory(this.storageUri);

    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (workspaceFolder) {
      this.projectId = this.generateProjectId(workspaceFolder.uri.fsPath);
      await this.loadState();
    }
  }

  /**
   * 索引当前工作区
   * @param onProgress - 进度回调
   * @param token - 取消令牌
   * @returns 索引的文件数
   */
  async indexWorkspace(
    onProgress?: (progress: IndexProgress) => void,
    token?: vscode.CancellationToken
  ): Promise<number> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      throw new Error('没有打开的工作区');
    }

    const count = await this.indexer.indexWorkspace(
      workspaceFolder.uri,
      onProgress,
      token
    );
    this.lastIndexTime = Date.now();
    await this.saveState();
    return count;
  }

  /**
   * 增量索引单个文件
   * @param fileUri - 文件 URI
   */
  async indexFile(fileUri: vscode.Uri): Promise<void> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      return;
    }
    await this.indexer.indexFile(fileUri, workspaceFolder.uri);
    this.debouncedSave();
  }

  /**
   * 根据查询文本搜索记忆
   * @param query - 查询文本
   * @param topK - 最大返回结果数
   * @param typeFilter - 可选的类型过滤
   * @returns 搜索结果列表
   */
  search(
    query: string,
    topK?: number,
    typeFilter?: RecordMetadata['type']
  ): SearchResult[] {
    const k =
      topK ||
      vscode.workspace
        .getConfiguration('contextkeep')
        .get<number>('topKResults') ||
      10;

    const queryVector = this.embedder.embed(query);
    return this.store.search(queryVector, k, typeFilter ? (m) => m.type === typeFilter : undefined);
  }

  /**
   * 添加一条上下文笔记
   * @param content - 笔记内容
   * @param tags - 标签列表
   * @returns 记录 ID
   */
  addNote(content: string, tags?: string[]): string {
    const id = `note:${Date.now()}-${this.noteCounter++}`;
    const vector = this.embedder.embed(content);
    this.store.upsert(id, vector, {
      type: 'note',
      summary: content.slice(0, 100),
      content,
      tags,
    });
    this.debouncedSave();
    return id;
  }

  /**
   * 记录一条决策
   * @param decision - 决策内容
   * @param context - 决策上下文
   * @returns 记录 ID
   */
  addDecision(decision: string, context?: string): string {
    const fullContent = context
      ? `决策: ${decision}\n上下文: ${context}`
      : `决策: ${decision}`;
    const id = `decision:${Date.now()}-${this.noteCounter++}`;
    const vector = this.embedder.embed(fullContent);
    this.store.upsert(id, vector, {
      type: 'decision',
      summary: decision.slice(0, 100),
      content: fullContent,
      tags: ['decision'],
    });
    this.debouncedSave();
    return id;
  }

  /**
   * 生成可注入 AI 助手的上下文摘要
   * @param query - 查询/任务描述
   * @param maxTokens - 最大 token 估算字符数
   * @returns 格式化的上下文文本
   */
  generateContextInjection(query: string, maxTokens = 4000): string {
    const results = this.search(query, 15);
    if (results.length === 0) {
      return '没有找到相关上下文。';
    }

    const parts: string[] = [
      '## ContextKeep 项目记忆\n',
      `> 项目 ID: ${this.projectId}`,
      `> 上次索引: ${this.lastIndexTime ? new Date(this.lastIndexTime).toLocaleString() : '未索引'}`,
      `> 记忆总数: ${this.store.size}\n`,
      '### 相关上下文\n',
    ];

    let totalChars = parts.join('\n').length;
    const charLimit = maxTokens * 4;

    for (const result of results) {
      if (result.score < 0.05) {
        break;
      }
      const entry = this.formatResultEntry(result);
      if (totalChars + entry.length > charLimit) {
        break;
      }
      parts.push(entry);
      totalChars += entry.length;
    }

    return parts.join('\n');
  }

  /**
   * 清除所有记忆
   */
  async clearMemory(): Promise<void> {
    this.store.clear();
    this.embedder = new TextEmbedder();
    this.lastIndexTime = 0;
    await this.saveState();
  }

  /** 获取存储统计信息 */
  getStats(): StoreStats & { lastIndexTime: number; projectId: string } {
    return {
      ...this.store.getStats(),
      lastIndexTime: this.lastIndexTime,
      projectId: this.projectId,
    };
  }

  /** 当前是否正在索引 */
  get isIndexing(): boolean {
    return this.indexer.indexing;
  }

  /**
   * 手动触发保存
   */
  async forceSave(): Promise<void> {
    await this.saveState();
  }

  /**
   * 格式化单条搜索结果
   * @param result - 搜索结果
   * @returns 格式化的文本
   */
  private formatResultEntry(result: SearchResult): string {
    const { record, score } = result;
    const m = record.metadata;
    const header =
      m.filePath
        ? `**${m.filePath}** (${m.type}, 相似度: ${(score * 100).toFixed(1)}%)`
        : `**${m.type}** (相似度: ${(score * 100).toFixed(1)}%)`;

    const lineInfo =
      m.lineRange ? ` [L${m.lineRange.start}-L${m.lineRange.end}]` : '';
    const contentPreview =
      m.content.length > 500 ? m.content.slice(0, 500) + '...' : m.content;

    return `\n${header}${lineInfo}\n\`\`\`${m.language || ''}\n${contentPreview}\n\`\`\`\n`;
  }

  /**
   * 生成项目的唯一标识符
   * @param workspacePath - 工作区路径
   * @returns 项目 ID
   */
  private generateProjectId(workspacePath: string): string {
    const folderName = path.basename(workspacePath);
    let hash = 0;
    for (let i = 0; i < workspacePath.length; i++) {
      const chr = workspacePath.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0;
    }
    return `${folderName}-${Math.abs(hash).toString(36)}`;
  }

  /**
   * 获取当前项目的存储文件路径
   * @returns 存储文件 URI
   */
  private getStateFileUri(): vscode.Uri | null {
    if (!this.storageUri || !this.projectId) {
      return null;
    }
    return vscode.Uri.joinPath(
      this.storageUri,
      `${this.projectId}.contextkeep.json`
    );
  }

  /**
   * 从磁盘加载持久化状态
   */
  private async loadState(): Promise<void> {
    const fileUri = this.getStateFileUri();
    if (!fileUri) {
      return;
    }
    try {
      const data = await vscode.workspace.fs.readFile(fileUri);
      const state: PersistedState = JSON.parse(
        Buffer.from(data).toString('utf8')
      );
      this.embedder = TextEmbedder.deserialize(state.embedder);
      const maxItems =
        vscode.workspace
          .getConfiguration('contextkeep')
          .get<number>('maxMemoryItems') || 5000;
      this.store = VectorStore.deserialize(state.store, maxItems);
      this.lastIndexTime = state.lastIndexTime;

      const indexerField = this.indexer as unknown as {
        embedder: TextEmbedder;
        store: VectorStore;
      };
      indexerField.embedder = this.embedder;
      indexerField.store = this.store;
    } catch {
      // no persisted state or corrupted — start fresh
    }
  }

  /**
   * 将当前状态持久化到磁盘
   */
  private async saveState(): Promise<void> {
    const fileUri = this.getStateFileUri();
    if (!fileUri) {
      return;
    }
    const state: PersistedState = {
      embedder: this.embedder.serialize(),
      store: this.store.serialize(),
      lastIndexTime: this.lastIndexTime,
      projectId: this.projectId,
    };
    const content = Buffer.from(JSON.stringify(state), 'utf8');
    await vscode.workspace.fs.writeFile(fileUri, content);
  }

  /**
   * 防抖保存（避免频繁写入磁盘）
   */
  private debouncedSave(): void {
    if (this.saveDebounceTimer) {
      clearTimeout(this.saveDebounceTimer);
    }
    this.saveDebounceTimer = setTimeout(() => {
      this.saveState().catch(() => {});
    }, 5000);
  }
}
