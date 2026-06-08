/**
 * @module embeddings
 * @description 基于 TF-IDF 的本地文本嵌入引擎，无需外部 API。
 * 将文本转换为向量表示，用于语义相似度检索。
 */

/** TF-IDF 词汇表中的一项 */
interface VocabEntry {
  /** 逆文档频率 */
  idf: number;
  /** 词汇在全局词汇表中的索引 */
  index: number;
}

/**
 * 基于 TF-IDF 的轻量级文本嵌入器。
 * 不依赖外部模型或 API，完全本地运行。
 */
export class TextEmbedder {
  private vocabulary: Map<string, VocabEntry> = new Map();
  private documentCount = 0;
  private readonly maxVocabSize: number;
  private readonly vectorDimension: number;

  /**
   * @param maxVocabSize - 词汇表最大容量
   * @param vectorDimension - 输出向量维度（通过哈希投影降维）
   */
  constructor(maxVocabSize = 10000, vectorDimension = 256) {
    this.maxVocabSize = maxVocabSize;
    this.vectorDimension = vectorDimension;
  }

  /**
   * 对文本进行分词处理
   * @param text - 输入文本
   * @returns 分词后的 token 数组
   */
  tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s\u4e00-\u9fff]/g, ' ')
      .split(/\s+/)
      .filter((token) => token.length > 1 && token.length < 50);
  }

  /**
   * 使用一批文档训练词汇表
   * @param documents - 文档文本数组
   */
  fit(documents: string[]): void {
    const docFreq = new Map<string, number>();
    this.documentCount = documents.length;

    for (const doc of documents) {
      const tokens = new Set(this.tokenize(doc));
      for (const token of tokens) {
        docFreq.set(token, (docFreq.get(token) || 0) + 1);
      }
    }

    const sortedTerms = [...docFreq.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, this.maxVocabSize);

    this.vocabulary.clear();
    let index = 0;
    for (const [term, freq] of sortedTerms) {
      const idf = Math.log((this.documentCount + 1) / (freq + 1)) + 1;
      this.vocabulary.set(term, { idf, index });
      index++;
    }
  }

  /**
   * 将文本转换为固定维度的向量
   * @param text - 输入文本
   * @returns 归一化后的浮点数向量
   */
  embed(text: string): number[] {
    const tokens = this.tokenize(text);
    const tf = new Map<string, number>();

    for (const token of tokens) {
      tf.set(token, (tf.get(token) || 0) + 1);
    }

    const sparseVector = new Map<number, number>();
    for (const [token, count] of tf) {
      const vocabEntry = this.vocabulary.get(token);
      if (vocabEntry) {
        const tfidf = (count / tokens.length) * vocabEntry.idf;
        sparseVector.set(vocabEntry.index, tfidf);
      }
    }

    const denseVector = new Array(this.vectorDimension).fill(0);
    for (const [idx, value] of sparseVector) {
      const projectedIdx = this.hashProject(idx);
      denseVector[projectedIdx] += value;
    }

    return this.normalize(denseVector);
  }

  /**
   * 哈希投影：将高维稀疏索引映射到低维空间
   * @param index - 原始词汇索引
   * @returns 投影后的维度索引
   */
  private hashProject(index: number): number {
    let hash = index * 2654435761;
    hash = ((hash >>> 16) ^ hash) * 0x45d9f3b;
    hash = (hash >>> 16) ^ hash;
    return Math.abs(hash) % this.vectorDimension;
  }

  /**
   * L2 归一化向量
   * @param vector - 输入向量
   * @returns 归一化后的向量
   */
  private normalize(vector: number[]): number[] {
    const magnitude = Math.sqrt(
      vector.reduce((sum, val) => sum + val * val, 0)
    );
    if (magnitude === 0) {
      return vector;
    }
    return vector.map((val) => val / magnitude);
  }

  /**
   * 计算两个向量的余弦相似度
   * @param a - 向量 A
   * @param b - 向量 B
   * @returns 相似度得分 [-1, 1]
   */
  static cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      return 0;
    }
    let dotProduct = 0;
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
    }
    return dotProduct;
  }

  /**
   * 序列化嵌入器状态用于持久化
   * @returns 可序列化的状态对象
   */
  serialize(): EmbedderState {
    return {
      vocabulary: Array.from(this.vocabulary.entries()),
      documentCount: this.documentCount,
      maxVocabSize: this.maxVocabSize,
      vectorDimension: this.vectorDimension,
    };
  }

  /**
   * 从序列化状态恢复嵌入器
   * @param state - 之前保存的状态
   * @returns 恢复后的 TextEmbedder 实例
   */
  static deserialize(state: EmbedderState): TextEmbedder {
    const embedder = new TextEmbedder(
      state.maxVocabSize,
      state.vectorDimension
    );
    embedder.vocabulary = new Map(state.vocabulary);
    embedder.documentCount = state.documentCount;
    return embedder;
  }
}

/** 嵌入器可序列化状态 */
export interface EmbedderState {
  vocabulary: [string, VocabEntry][];
  documentCount: number;
  maxVocabSize: number;
  vectorDimension: number;
}
