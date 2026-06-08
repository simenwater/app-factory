/**
 * @module indexer
 * @description 项目上下文自动索引器。
 * 扫描工作区文件，提取代码结构信息，生成向量索引。
 */

import * as vscode from 'vscode';
import * as path from 'path';
import { TextEmbedder } from './embeddings';
import { VectorStore, RecordMetadata } from './vectorStore';

/** 索引进度回调 */
export interface IndexProgress {
  current: number;
  total: number;
  currentFile: string;
}

/** 代码片段信息 */
interface CodeChunk {
  content: string;
  filePath: string;
  language: string;
  lineRange: { start: number; end: number };
  type: 'file' | 'snippet';
  summary: string;
}

/**
 * 项目文件索引器。
 * 负责扫描工作区、提取代码结构、生成嵌入向量并写入存储。
 */
export class ProjectIndexer {
  private embedder: TextEmbedder;
  private store: VectorStore;
  private isIndexing = false;

  /**
   * @param embedder - 文本嵌入器实例
   * @param store - 向量存储实例
   */
  constructor(embedder: TextEmbedder, store: VectorStore) {
    this.embedder = embedder;
    this.store = store;
  }

  /** 当前是否正在索引 */
  get indexing(): boolean {
    return this.isIndexing;
  }

  /**
   * 索引整个工作区
   * @param workspaceRoot - 工作区根目录 URI
   * @param onProgress - 进度回调函数
   * @param token - 取消令牌
   * @returns 索引的文件数量
   */
  async indexWorkspace(
    workspaceRoot: vscode.Uri,
    onProgress?: (progress: IndexProgress) => void,
    token?: vscode.CancellationToken
  ): Promise<number> {
    if (this.isIndexing) {
      throw new Error('索引正在进行中');
    }

    this.isIndexing = true;
    try {
      const config = vscode.workspace.getConfiguration('contextkeep');
      const excludePatterns = config.get<string[]>('excludePatterns') || [];
      const maxFileSize = config.get<number>('maxFileSize') || 102400;

      const files = await this.findFiles(workspaceRoot, excludePatterns);
      const chunks: CodeChunk[] = [];

      let processed = 0;
      for (const file of files) {
        if (token?.isCancellationRequested) {
          break;
        }

        try {
          const relativePath = path.relative(
            workspaceRoot.fsPath,
            file.fsPath
          );
          onProgress?.({
            current: processed,
            total: files.length,
            currentFile: relativePath,
          });

          const stat = await vscode.workspace.fs.stat(file);
          if (stat.size > maxFileSize) {
            continue;
          }

          const content = Buffer.from(
            await vscode.workspace.fs.readFile(file)
          ).toString('utf8');

          const language = this.detectLanguage(file.fsPath);
          const fileChunks = this.chunkFile(
            content,
            relativePath,
            language
          );
          chunks.push(...fileChunks);
          processed++;
        } catch {
          // skip unreadable files
        }
      }

      this.trainAndIndex(chunks);
      return processed;
    } finally {
      this.isIndexing = false;
    }
  }

  /**
   * 增量索引单个文件
   * @param fileUri - 文件 URI
   * @param workspaceRoot - 工作区根目录 URI
   */
  async indexFile(
    fileUri: vscode.Uri,
    workspaceRoot: vscode.Uri
  ): Promise<void> {
    const config = vscode.workspace.getConfiguration('contextkeep');
    const maxFileSize = config.get<number>('maxFileSize') || 102400;

    try {
      const stat = await vscode.workspace.fs.stat(fileUri);
      if (stat.size > maxFileSize) {
        return;
      }

      const content = Buffer.from(
        await vscode.workspace.fs.readFile(fileUri)
      ).toString('utf8');

      const relativePath = path.relative(
        workspaceRoot.fsPath,
        fileUri.fsPath
      );
      const language = this.detectLanguage(fileUri.fsPath);

      this.store.deleteWhere(
        (record) => record.metadata.filePath === relativePath
      );

      const chunks = this.chunkFile(content, relativePath, language);
      for (const chunk of chunks) {
        const vector = this.embedder.embed(chunk.content);
        const id = `${chunk.filePath}:${chunk.lineRange.start}-${chunk.lineRange.end}`;
        this.store.upsert(id, vector, {
          type: chunk.type,
          filePath: chunk.filePath,
          language: chunk.language,
          summary: chunk.summary,
          content: chunk.content,
          lineRange: chunk.lineRange,
        });
      }
    } catch {
      // skip unreadable file
    }
  }

  /**
   * 将文件内容拆分为可索引的块
   * @param content - 文件内容
   * @param filePath - 相对路径
   * @param language - 编程语言
   * @returns 代码块数组
   */
  chunkFile(
    content: string,
    filePath: string,
    language: string
  ): CodeChunk[] {
    const chunks: CodeChunk[] = [];
    const lines = content.split('\n');

    chunks.push({
      content: this.extractFileSummary(content, filePath),
      filePath,
      language,
      lineRange: { start: 1, end: Math.min(lines.length, 30) },
      type: 'file',
      summary: `文件: ${filePath}`,
    });

    const functionChunks = this.extractFunctions(lines, filePath, language);
    chunks.push(...functionChunks);

    if (lines.length > 60 && functionChunks.length === 0) {
      const windowSize = 40;
      const stride = 20;
      for (let i = 0; i < lines.length; i += stride) {
        const end = Math.min(i + windowSize, lines.length);
        const chunkContent = lines.slice(i, end).join('\n');
        if (chunkContent.trim().length > 50) {
          chunks.push({
            content: chunkContent,
            filePath,
            language,
            lineRange: { start: i + 1, end },
            type: 'snippet',
            summary: `${filePath} [L${i + 1}-L${end}]`,
          });
        }
      }
    }

    return chunks;
  }

  /**
   * 提取文件摘要（前 30 行 + 导入 + 导出等关键信息）
   * @param content - 文件内容
   * @param filePath - 文件路径
   * @returns 摘要文本
   */
  private extractFileSummary(content: string, filePath: string): string {
    const lines = content.split('\n');
    const topLines = lines.slice(0, 30).join('\n');
    const imports = lines
      .filter(
        (l) =>
          l.startsWith('import ') ||
          l.startsWith('from ') ||
          l.startsWith('require(') ||
          l.includes('require(')
      )
      .join('\n');
    const exports = lines
      .filter(
        (l) =>
          l.startsWith('export ') ||
          l.includes('module.exports') ||
          l.includes('export default')
      )
      .join('\n');

    return `文件: ${filePath}\n---\n${topLines}\n---\n导入:\n${imports}\n导出:\n${exports}`;
  }

  /**
   * 简单的函数/类提取器
   * @param lines - 源代码行
   * @param filePath - 文件路径
   * @param language - 编程语言
   * @returns 提取到的函数/类代码块
   */
  extractFunctions(
    lines: string[],
    filePath: string,
    language: string
  ): CodeChunk[] {
    const chunks: CodeChunk[] = [];
    const patterns = [
      /^(?:export\s+)?(?:async\s+)?function\s+(\w+)/,
      /^(?:export\s+)?(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?\(/,
      /^(?:export\s+)?(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?(?:\([^)]*\)|[^=])\s*=>/,
      /^(?:export\s+)?class\s+(\w+)/,
      /^\s+(?:async\s+)?(\w+)\s*\([^)]*\)\s*(?::\s*\w+)?\s*\{/,
      /^def\s+(\w+)/,
      /^class\s+(\w+)/,
      /^func\s+(\w+)/,
      /^fn\s+(\w+)/,
    ];

    let currentBlock: { name: string; start: number; braceCount: number } | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (!currentBlock) {
        for (const pattern of patterns) {
          const match = line.match(pattern);
          if (match) {
            currentBlock = {
              name: match[1],
              start: i,
              braceCount: 0,
            };
            break;
          }
        }
      }

      if (currentBlock) {
        for (const char of line) {
          if (char === '{') {currentBlock.braceCount++;}
          if (char === '}') {currentBlock.braceCount--;}
        }

        const blockLength = i - currentBlock.start + 1;

        if (
          (currentBlock.braceCount <= 0 && blockLength > 1) ||
          blockLength > 100
        ) {
          const end = Math.min(i + 1, lines.length);
          const content = lines.slice(currentBlock.start, end).join('\n');
          if (content.trim().length > 20) {
            chunks.push({
              content,
              filePath,
              language,
              lineRange: { start: currentBlock.start + 1, end },
              type: 'snippet',
              summary: `${currentBlock.name} in ${filePath}`,
            });
          }
          currentBlock = null;
        }
      }
    }

    return chunks;
  }

  /**
   * 从文件扩展名推断编程语言
   * @param filePath - 文件路径
   * @returns 编程语言标识符
   */
  private detectLanguage(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const languageMap: Record<string, string> = {
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.py': 'python',
      '.go': 'go',
      '.rs': 'rust',
      '.java': 'java',
      '.c': 'c',
      '.cpp': 'cpp',
      '.h': 'c',
      '.hpp': 'cpp',
      '.cs': 'csharp',
      '.rb': 'ruby',
      '.php': 'php',
      '.swift': 'swift',
      '.kt': 'kotlin',
      '.md': 'markdown',
      '.json': 'json',
      '.yaml': 'yaml',
      '.yml': 'yaml',
      '.toml': 'toml',
      '.html': 'html',
      '.css': 'css',
      '.scss': 'scss',
      '.vue': 'vue',
      '.svelte': 'svelte',
    };
    return languageMap[ext] || 'unknown';
  }

  /**
   * 查找工作区中的所有可索引文件
   * @param workspaceRoot - 工作区根目录
   * @param excludePatterns - 排除模式列表
   * @returns 文件 URI 列表
   */
  private async findFiles(
    workspaceRoot: vscode.Uri,
    excludePatterns: string[]
  ): Promise<vscode.Uri[]> {
    const excludeGlob = `{${excludePatterns.join(',')}}`;
    const files = await vscode.workspace.findFiles(
      new vscode.RelativePattern(workspaceRoot, '**/*'),
      excludeGlob,
      10000
    );
    return files;
  }

  /**
   * 训练嵌入器并将所有代码块写入向量存储
   * @param chunks - 待索引的代码块
   */
  private trainAndIndex(chunks: CodeChunk[]): void {
    const documents = chunks.map((c) => c.content);
    this.embedder.fit(documents);

    for (const chunk of chunks) {
      const vector = this.embedder.embed(chunk.content);
      const id = `${chunk.filePath}:${chunk.lineRange.start}-${chunk.lineRange.end}`;
      const metadata: RecordMetadata = {
        type: chunk.type,
        filePath: chunk.filePath,
        language: chunk.language,
        summary: chunk.summary,
        content: chunk.content,
        lineRange: chunk.lineRange,
      };
      this.store.upsert(id, vector, metadata);
    }
  }
}
