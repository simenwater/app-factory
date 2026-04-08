/**
 * @description GitHub 仓库信息
 */
export interface RepoInfo {
  owner: string;
  name: string;
  description: string;
  language: string;
  languages: Record<string, number>;
  framework: string | null;
  packageManager: string | null;
  hasTests: boolean;
  hasCi: boolean;
  structure: DirectoryNode[];
  files: string[];
  configFiles: string[];
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

/**
 * @description 目录树节点
 */
export interface DirectoryNode {
  name: string;
  type: "file" | "directory";
  children?: DirectoryNode[];
}

/**
 * @description AI 助手配置格式
 */
export type AgentFormat =
  | "cursor"
  | "github-copilot"
  | "claude"
  | "generic";

/**
 * @description 生成配置选项
 */
export interface GenerateOptions {
  repoUrl: string;
  format: AgentFormat;
  includeCodeStyle: boolean;
  includeArchitecture: boolean;
  includeDependencies: boolean;
  includeTestingGuide: boolean;
  includeContributing: boolean;
  customInstructions: string;
}

/**
 * @description 生成结果
 */
export interface GenerateResult {
  content: string;
  filename: string;
  format: AgentFormat;
  repoInfo: RepoInfo;
}

/**
 * @description 定价方案
 */
export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  priceNote: string;
  features: string[];
  highlighted: boolean;
  cta: string;
}

/**
 * @description 应用全局状态
 */
export interface AppState {
  repoUrl: string;
  repoInfo: RepoInfo | null;
  format: AgentFormat;
  options: Omit<GenerateOptions, "repoUrl" | "format">;
  result: GenerateResult | null;
  loading: boolean;
  error: string | null;
  darkMode: boolean;
  generationCount: number;

  setRepoUrl: (url: string) => void;
  setFormat: (format: AgentFormat) => void;
  setOptions: (options: Partial<Omit<GenerateOptions, "repoUrl" | "format">>) => void;
  setResult: (result: GenerateResult | null) => void;
  setRepoInfo: (info: RepoInfo | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleDarkMode: () => void;
  incrementGeneration: () => void;
  reset: () => void;
}
