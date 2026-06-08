/**
 * @module vectorStore
 * @description 本地向量数据库，支持向量存储、检索和持久化。
 * 基于余弦相似度实现近似最近邻搜索。
 */

import { TextEmbedder } from './embeddings';

/** 向量存储中的单条记录 */
export interface VectorRecord {
  /** 唯一标识符 */
  id: string;
  /** 向量表示 */
  vector: number[];
  /** 关联的元数据 */
  metadata: RecordMetadata;
  /** 创建时间戳 */
  createdAt: number;
  /** 最后访问时间戳 */
  lastAccessedAt: number;
}

/** 记录的元数据 */
export interface RecordMetadata {
  /** 记录类型 */
  type: 'file' | 'snippet' | 'note' | 'decision' | 'conversation';
  /** 文件路径（相对于项目根目录） */
  filePath?: string;
  /** 编程语言 */
  language?: string;
  /** 原始文本摘要 */
  summary: string;
  /** 原始文本内容 */
  content: string;
  /** 行号范围 */
  lineRange?: { start: number; end: number };
  /** 自定义标签 */
  tags?: string[];
}

/** 检索结果 */
export interface SearchResult {
  record: VectorRecord;
  score: number;
}

/** 向量存储的可序列化状态 */
export interface VectorStoreState {
  records: VectorRecord[];
  version: number;
}

/**
 * 本地向量数据库实现。
 * 使用内存中的向量数组进行暴力搜索（适合万级数据量），
 * 支持序列化到磁盘实现持久化。
 */
export class VectorStore {
  private records: Map<string, VectorRecord> = new Map();
  private readonly maxRecords: number;

  /** 存储格式版本号 */
  static readonly VERSION = 1;

  /**
   * @param maxRecords - 最大记录数量
   */
  constructor(maxRecords = 5000) {
    this.maxRecords = maxRecords;
  }

  /**
   * 添加或更新一条记录
   * @param id - 记录 ID
   * @param vector - 向量表示
   * @param metadata - 记录元数据
   */
  upsert(id: string, vector: number[], metadata: RecordMetadata): void {
    const now = Date.now();
    const existing = this.records.get(id);

    this.records.set(id, {
      id,
      vector,
      metadata,
      createdAt: existing?.createdAt ?? now,
      lastAccessedAt: now,
    });

    if (this.records.size > this.maxRecords) {
      this.evictOldest();
    }
  }

  /**
   * 根据向量相似度搜索
   * @param queryVector - 查询向量
   * @param topK - 返回的最大结果数
   * @param filter - 可选的元数据过滤函数
   * @returns 按相似度降序排列的搜索结果
   */
  search(
    queryVector: number[],
    topK = 10,
    filter?: (metadata: RecordMetadata) => boolean
  ): SearchResult[] {
    const results: SearchResult[] = [];

    for (const record of this.records.values()) {
      if (filter && !filter(record.metadata)) {
        continue;
      }

      const score = TextEmbedder.cosineSimilarity(queryVector, record.vector);
      results.push({ record, score });
    }

    results.sort((a, b) => b.score - a.score);

    const topResults = results.slice(0, topK);
    const now = Date.now();
    for (const result of topResults) {
      result.record.lastAccessedAt = now;
    }

    return topResults;
  }

  /**
   * 根据 ID 获取记录
   * @param id - 记录 ID
   * @returns 对应的记录，不存在则返回 undefined
   */
  get(id: string): VectorRecord | undefined {
    return this.records.get(id);
  }

  /**
   * 删除指定记录
   * @param id - 记录 ID
   * @returns 是否删除成功
   */
  delete(id: string): boolean {
    return this.records.delete(id);
  }

  /**
   * 批量删除满足条件的记录
   * @param filter - 过滤函数，返回 true 的记录将被删除
   * @returns 被删除的记录数
   */
  deleteWhere(filter: (record: VectorRecord) => boolean): number {
    let count = 0;
    for (const [id, record] of this.records) {
      if (filter(record)) {
        this.records.delete(id);
        count++;
      }
    }
    return count;
  }

  /** 清除所有记录 */
  clear(): void {
    this.records.clear();
  }

  /** 获取当前记录总数 */
  get size(): number {
    return this.records.size;
  }

  /**
   * 获取统计信息
   * @returns 存储统计摘要
   */
  getStats(): StoreStats {
    const types = new Map<string, number>();
    const languages = new Map<string, number>();

    for (const record of this.records.values()) {
      types.set(
        record.metadata.type,
        (types.get(record.metadata.type) || 0) + 1
      );
      if (record.metadata.language) {
        languages.set(
          record.metadata.language,
          (languages.get(record.metadata.language) || 0) + 1
        );
      }
    }

    return {
      totalRecords: this.records.size,
      maxRecords: this.maxRecords,
      typeDistribution: Object.fromEntries(types),
      languageDistribution: Object.fromEntries(languages),
    };
  }

  /**
   * 序列化存储状态
   * @returns 可序列化的状态对象
   */
  serialize(): VectorStoreState {
    return {
      records: Array.from(this.records.values()),
      version: VectorStore.VERSION,
    };
  }

  /**
   * 从序列化状态恢复
   * @param state - 之前保存的状态
   * @returns 恢复后的 VectorStore 实例
   */
  static deserialize(state: VectorStoreState, maxRecords = 5000): VectorStore {
    const store = new VectorStore(maxRecords);
    if (state.version !== VectorStore.VERSION) {
      return store;
    }
    for (const record of state.records) {
      store.records.set(record.id, record);
    }
    return store;
  }

  /** 淘汰最久未访问的记录 */
  private evictOldest(): void {
    const sortedByAccess = Array.from(this.records.values()).sort(
      (a, b) => a.lastAccessedAt - b.lastAccessedAt
    );

    const toRemove = Math.ceil(this.maxRecords * 0.1);
    for (let i = 0; i < toRemove && i < sortedByAccess.length; i++) {
      this.records.delete(sortedByAccess[i].id);
    }
  }
}

/** 存储统计信息 */
export interface StoreStats {
  totalRecords: number;
  maxRecords: number;
  typeDistribution: Record<string, number>;
  languageDistribution: Record<string, number>;
}
