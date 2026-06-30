/**
 * @fileoverview AGENTS.md 及多工具配置文件生成引擎
 * 根据代码库分析结果，使用 LLM 生成适配不同 AI 编码工具的配置文件
 */

import OpenAI from 'openai';
import type { AnalysisResult, ToolStandard, GeneratedConfig } from '@/types';

/**
 * 创建 OpenAI 客户端
 * @returns {OpenAI} OpenAI 客户端实例
 */
function createOpenAIClient(): OpenAI {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

/**
 * 构建用于 LLM 的分析摘要
 * @param {AnalysisResult} analysis - 代码库分析结果
 * @returns {string} 格式化的摘要文本
 */
export function buildAnalysisSummary(analysis: AnalysisResult): string {
  const topDirs = analysis.structure
    .filter((n) => n.type === 'dir')
    .map((n) => n.path)
    .filter((p) => !p.includes('/'))
    .slice(0, 15);

  const keyFiles = analysis.structure
    .filter((n) => n.type === 'file')
    .map((n) => n.path)
    .filter((p) => !p.includes('/'))
    .slice(0, 20);

  return `
## Repository: ${analysis.repo.fullName}
- Description: ${analysis.repo.description}
- Primary Language: ${analysis.repo.language}
- Languages: ${Object.keys(analysis.repo.languages).join(', ')}
- Stars: ${analysis.repo.stars} | Forks: ${analysis.repo.forks}
- Topics: ${analysis.repo.topics.join(', ')}

## Detected Stack
- Frameworks: ${analysis.frameworks.join(', ') || 'None detected'}
- Build Tools: ${analysis.buildTools.join(', ') || 'None detected'}
- Testing: ${analysis.testingTools.join(', ') || 'None detected'}
- Package Manager: ${analysis.packageManager}

## Project Structure
Top-level directories: ${topDirs.join(', ')}
Root files: ${keyFiles.join(', ')}
Entry points: ${analysis.entryPoints.join(', ') || 'Not detected'}
Config files: ${analysis.configFiles.join(', ')}

## File Count: ${analysis.structure.length} items
`.trim();
}

/**
 * 不同工具标准的系统提示词
 */
const SYSTEM_PROMPTS: Record<ToolStandard, string> = {
  cursor: `You are an expert at creating AGENTS.md files for Cursor IDE.
The AGENTS.md file helps Cursor's AI understand a codebase.
Generate a comprehensive AGENTS.md that includes:
1. Project overview and architecture
2. Directory structure explanation
3. Key conventions and patterns used
4. Build, test, and run commands
5. Important configuration details
6. Code style guidelines
7. Common patterns and anti-patterns
Format in clean Markdown with clear headers.`,

  claude: `You are an expert at creating CLAUDE.md files for Claude Code.
The CLAUDE.md file helps Claude understand a codebase for effective assistance.
Generate a comprehensive CLAUDE.md that includes:
1. Project summary and purpose
2. Architecture overview
3. Key directories and their roles
4. Development workflow commands
5. Testing approach
6. Code conventions
7. Important context for code changes
Format in clean Markdown optimized for Claude's understanding.`,

  copilot: `You are an expert at creating .github/copilot-instructions.md files.
This file helps GitHub Copilot understand project context.
Generate a comprehensive copilot-instructions.md that includes:
1. Project description
2. Tech stack details
3. Coding conventions
4. File organization
5. Common patterns
6. Testing requirements
7. Build and deployment info
Format in clean Markdown with clear sections.`,
};

/**
 * 各工具标准对应的输出文件名
 */
const STANDARD_FILENAMES: Record<ToolStandard, string> = {
  cursor: 'AGENTS.md',
  claude: 'CLAUDE.md',
  copilot: '.github/copilot-instructions.md',
};

/**
 * 使用 LLM 生成配置文件内容
 * @param {AnalysisResult} analysis - 分析结果
 * @param {ToolStandard} standard - 目标工具标准
 * @param {string} [customInstructions] - 自定义指令
 * @returns {Promise<string>} 生成的配置文件内容
 */
export async function generateWithLLM(
  analysis: AnalysisResult,
  standard: ToolStandard,
  customInstructions?: string
): Promise<string> {
  const client = createOpenAIClient();
  const summary = buildAnalysisSummary(analysis);

  const userPrompt = `Based on this repository analysis, generate the appropriate configuration file:

${summary}

${customInstructions ? `\nAdditional instructions from the user:\n${customInstructions}` : ''}

Generate a comprehensive, well-structured configuration file. Be specific about this project's actual stack and structure, not generic.`;

  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPTS[standard] },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.3,
    max_tokens: 4000,
  });

  return completion.choices[0]?.message?.content || '';
}

/**
 * 基于模板的本地生成（无需 LLM API Key 时的降级方案）
 * @param {AnalysisResult} analysis - 分析结果
 * @param {ToolStandard} standard - 目标工具标准
 * @returns {string} 生成的配置文件内容
 */
export function generateFromTemplate(
  analysis: AnalysisResult,
  standard: ToolStandard
): string {
  const { repo, frameworks, buildTools, testingTools, packageManager, entryPoints, configFiles } = analysis;

  const langBreakdown = Object.entries(repo.languages)
    .sort(([, a], [, b]) => b - a)
    .map(([lang, bytes]) => `- ${lang}: ${(bytes / 1024).toFixed(1)} KB`)
    .join('\n');

  const runCmd = packageManager === 'npm' ? 'npm run' :
    packageManager === 'yarn' ? 'yarn' :
    packageManager === 'pnpm' ? 'pnpm' :
    packageManager === 'bun' ? 'bun run' : './';

  const title = standard === 'cursor' ? 'AGENTS.md' :
    standard === 'claude' ? 'CLAUDE.md' : 'Copilot Instructions';

  return `# ${title} - ${repo.fullName}

## Project Overview

${repo.description || `${repo.name} is a ${repo.language} project.`}

**Repository**: [${repo.fullName}](https://github.com/${repo.fullName})

## Tech Stack

- **Primary Language**: ${repo.language}
${frameworks.length > 0 ? `- **Frameworks**: ${frameworks.join(', ')}` : ''}
${buildTools.length > 0 ? `- **Build Tools**: ${buildTools.join(', ')}` : ''}
${testingTools.length > 0 ? `- **Testing**: ${testingTools.join(', ')}` : ''}
- **Package Manager**: ${packageManager}

### Language Breakdown
${langBreakdown || 'Not available'}

## Project Structure

\`\`\`
${analysis.structure
  .filter((n) => n.type === 'dir' && n.path.split('/').length <= 2)
  .map((n) => `${n.path}/`)
  .slice(0, 20)
  .join('\n')}
\`\`\`

${entryPoints.length > 0 ? `### Entry Points\n${entryPoints.map((e) => `- \`${e}\``).join('\n')}` : ''}

${configFiles.length > 0 ? `### Configuration Files\n${configFiles.map((c) => `- \`${c}\``).join('\n')}` : ''}

## Development Commands

\`\`\`bash
# Install dependencies
${packageManager === 'npm' ? 'npm install' : `${packageManager} install`}

# Development
${runCmd} dev

# Build
${runCmd} build

# Test
${runCmd} test

# Lint
${runCmd} lint
\`\`\`

## Code Conventions

${standard === 'cursor' ? `### For Cursor AI
- Follow existing code patterns in the repository
- Use ${repo.language} idioms and best practices
- Maintain consistent naming conventions
- Add appropriate type annotations where applicable
- Write tests for new functionality` : ''}

${standard === 'claude' ? `### For Claude
- This is a ${repo.language} project using ${frameworks.join(', ') || 'standard tooling'}
- Follow existing code style and patterns
- Provide explanations for complex logic
- Consider backward compatibility when making changes` : ''}

${standard === 'copilot' ? `### For GitHub Copilot
- Project uses ${repo.language} as primary language
- Follow ${frameworks.join(', ') || 'standard'} conventions
- Auto-complete should respect existing patterns
- Test files should follow existing test structure` : ''}

## Topics
${repo.topics.length > 0 ? repo.topics.map((t) => `\`${t}\``).join(' ') : 'No topics specified'}

---

*Generated by [AgentContext](https://agentcontext.dev) - AI-powered agent configuration for your codebase*
`;
}

/**
 * 生成配置文件（优先使用 LLM，降级使用模板）
 * @param {AnalysisResult} analysis - 分析结果
 * @param {ToolStandard} standard - 目标工具标准
 * @param {string} [customInstructions] - 自定义指令
 * @returns {Promise<GeneratedConfig>} 生成的配置文件
 */
export async function generateConfig(
  analysis: AnalysisResult,
  standard: ToolStandard,
  customInstructions?: string
): Promise<GeneratedConfig> {
  let content: string;

  if (process.env.OPENAI_API_KEY) {
    try {
      content = await generateWithLLM(analysis, standard, customInstructions);
    } catch {
      content = generateFromTemplate(analysis, standard);
    }
  } else {
    content = generateFromTemplate(analysis, standard);
  }

  return {
    id: crypto.randomUUID(),
    analysisId: analysis.id,
    standard,
    filename: STANDARD_FILENAMES[standard],
    content,
    createdAt: new Date().toISOString(),
  };
}

/**
 * 批量生成多工具标准的配置文件
 * @param {AnalysisResult} analysis - 分析结果
 * @param {ToolStandard[]} standards - 目标工具标准列表
 * @param {string} [customInstructions] - 自定义指令
 * @returns {Promise<GeneratedConfig[]>} 生成的配置文件列表
 */
export async function generateMultiConfigs(
  analysis: AnalysisResult,
  standards: ToolStandard[],
  customInstructions?: string
): Promise<GeneratedConfig[]> {
  const configs = await Promise.all(
    standards.map((std) => generateConfig(analysis, std, customInstructions))
  );
  return configs;
}
