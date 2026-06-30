/**
 * @fileoverview 代码库分析器，整合 GitHub 数据并生成结构化分析结果
 */

import type { AnalysisResult } from '@/types';
import {
  parseRepoUrl,
  getRepoInfo,
  getRepoTree,
  getFileContent,
  detectFrameworks,
  detectBuildTools,
  detectTestingTools,
  detectPackageManager,
  detectConfigFiles,
  detectEntryPoints,
} from './github';

/**
 * 完整分析 GitHub 仓库
 * @param {string} repoUrl - GitHub 仓库 URL
 * @param {string} [token] - GitHub Token
 * @returns {Promise<AnalysisResult>} 分析结果
 */
export async function analyzeRepository(
  repoUrl: string,
  token?: string
): Promise<AnalysisResult> {
  const { owner, repo } = parseRepoUrl(repoUrl);

  const [repoInfo, tree] = await Promise.all([
    getRepoInfo(owner, repo, token),
    getRepoTree(owner, repo, token),
  ]);

  let packageJson: string | undefined;
  const pkgNode = tree.find(
    (n) => n.path === 'package.json' && n.type === 'file'
  );
  if (pkgNode) {
    packageJson = await getFileContent(owner, repo, 'package.json', token);
  }

  const frameworks = detectFrameworks(tree, packageJson);
  const buildTools = detectBuildTools(tree);
  const testingTools = detectTestingTools(tree, packageJson);
  const packageManager = detectPackageManager(tree);
  const configFiles = detectConfigFiles(tree);
  const entryPoints = detectEntryPoints(tree);

  return {
    id: crypto.randomUUID(),
    repo: repoInfo,
    structure: tree,
    frameworks,
    buildTools,
    testingTools,
    packageManager,
    entryPoints,
    configFiles,
    createdAt: new Date().toISOString(),
  };
}
