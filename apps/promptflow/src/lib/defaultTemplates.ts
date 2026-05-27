import type { PromptTemplate } from '@/types';

/**
 * @description 内置默认提示词模板库
 * @returns {PromptTemplate[]} 模板数组
 */
export const DEFAULT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'builtin-cursor-rules',
    title: 'Cursor 通用编码规范',
    description: '适用于 Cursor IDE 的通用编码规范和行为约束，涵盖代码风格、注释规范和错误处理',
    content: `You are an expert software engineer. Follow these rules:

## Code Style
- Use TypeScript with strict mode
- Prefer functional components with hooks
- Use descriptive variable names (avoid single letters except for iterators)
- Keep functions small and focused (max 30 lines)

## Comments
- Use JSDoc for public APIs
- Avoid redundant comments that repeat what the code does
- Comment "why", not "what"

## Error Handling
- Always handle errors explicitly
- Use try-catch for async operations
- Provide meaningful error messages

## Testing
- Write unit tests for all utility functions
- Use descriptive test names that explain the expected behavior
- Follow AAA pattern: Arrange, Act, Assert`,
    category: 'coding-style',
    platform: 'cursor',
    tags: ['typescript', '编码规范', '通用'],
    isBuiltIn: true,
    isFavorite: false,
    isShared: false,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    author: 'PromptFlow',
    versions: [],
  },
  {
    id: 'builtin-claude-context',
    title: 'Claude 上下文配置模板',
    description: '为 Claude AI 助手优化的系统提示词，定义助手角色、能力边界和输出格式',
    content: `You are a senior full-stack developer helping with a production codebase.

## Role & Behavior
- Always explain your reasoning before providing code
- Ask clarifying questions when requirements are ambiguous
- Suggest alternatives when you see potential issues
- Be concise but thorough

## Output Format
- Use markdown code blocks with language tags
- Include file paths as comments at the top of code blocks
- Provide step-by-step instructions for complex changes

## Constraints
- Do not modify files outside the specified scope
- Preserve existing code style and patterns
- Flag security concerns proactively
- Suggest tests for all new functionality`,
    category: 'context-rules',
    platform: 'claude',
    tags: ['claude', '上下文', '系统提示'],
    isBuiltIn: true,
    isFavorite: false,
    isShared: false,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    author: 'PromptFlow',
    versions: [],
  },
  {
    id: 'builtin-nextjs-setup',
    title: 'Next.js 项目初始化规范',
    description: '全面的 Next.js 项目技术栈配置和目录结构规范',
    content: `## Tech Stack
- Next.js 15 with App Router
- TypeScript in strict mode
- Tailwind CSS for styling
- Zustand for state management
- Jest + React Testing Library for tests

## Project Structure
\`\`\`
src/
├── app/           # Next.js App Router pages
├── components/    # Reusable UI components
├── lib/           # Utility functions and helpers
├── store/         # Zustand stores
├── types/         # TypeScript type definitions
└── __tests__/     # Test files
\`\`\`

## Conventions
- Use \`use client\` directive only when needed
- Prefer Server Components by default
- Use loading.tsx and error.tsx for route boundaries
- Keep components small and composable`,
    category: 'project-setup',
    platform: 'cursor',
    tags: ['nextjs', 'react', '项目结构'],
    isBuiltIn: true,
    isFavorite: false,
    isShared: false,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    author: 'PromptFlow',
    versions: [],
  },
  {
    id: 'builtin-debug-prompt',
    title: '系统化调试提示词',
    description: '引导 AI 进行系统化问题排查的提示词模板',
    content: `When debugging an issue, follow this systematic approach:

## 1. Reproduce
- Identify the exact steps to reproduce
- Note the expected vs actual behavior
- Check if the issue is consistent or intermittent

## 2. Isolate
- Narrow down to the smallest reproducing case
- Check recent changes that might have caused it
- Test in different environments if applicable

## 3. Diagnose
- Read error messages and stack traces carefully
- Add strategic console.log or breakpoints
- Check related component state and props
- Verify API responses and data flow

## 4. Fix
- Apply the minimal change to fix the issue
- Ensure the fix doesn't break other functionality
- Add a regression test

## 5. Verify
- Confirm the original issue is resolved
- Run the full test suite
- Check for edge cases`,
    category: 'debugging',
    platform: 'generic',
    tags: ['调试', '排错', '通用'],
    isBuiltIn: true,
    isFavorite: false,
    isShared: false,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    author: 'PromptFlow',
    versions: [],
  },
  {
    id: 'builtin-code-review',
    title: 'AI 代码审查清单',
    description: '指导 AI 进行全面代码审查的检查清单',
    content: `Review this code change with the following checklist:

## Correctness
- [ ] Logic is correct and handles edge cases
- [ ] Error handling is comprehensive
- [ ] No off-by-one errors or boundary issues

## Performance
- [ ] No unnecessary re-renders (React)
- [ ] Database queries are optimized
- [ ] No memory leaks or resource mismanagement

## Security
- [ ] Input is validated and sanitized
- [ ] No sensitive data exposure
- [ ] Authentication/authorization checks are in place

## Maintainability
- [ ] Code is readable and self-documenting
- [ ] Functions follow single responsibility principle
- [ ] Types are properly defined (no \`any\`)

## Testing
- [ ] New features have corresponding tests
- [ ] Edge cases are covered
- [ ] Tests are deterministic and independent`,
    category: 'code-review',
    platform: 'generic',
    tags: ['代码审查', 'review', '清单'],
    isBuiltIn: true,
    isFavorite: false,
    isShared: false,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    author: 'PromptFlow',
    versions: [],
  },
  {
    id: 'builtin-testing-prompt',
    title: '测试驱动开发提示词',
    description: '指导 AI 编写高质量测试用例的提示词',
    content: `When writing tests, follow these guidelines:

## Unit Tests
- Test one behavior per test case
- Use descriptive names: "should [expected behavior] when [condition]"
- Follow AAA: Arrange → Act → Assert
- Mock external dependencies

## Integration Tests
- Test component interactions
- Verify data flow between modules
- Test error boundaries and fallback states

## Test Structure
\`\`\`typescript
describe('ComponentName', () => {
  describe('when [scenario]', () => {
    it('should [expected behavior]', () => {
      // Arrange
      const input = createTestData();

      // Act
      const result = functionUnderTest(input);

      // Assert
      expect(result).toEqual(expectedOutput);
    });
  });
});
\`\`\`

## Best Practices
- Don't test implementation details
- Prefer integration tests over unit tests for UI
- Use factories for test data creation
- Keep tests DRY but readable`,
    category: 'testing',
    platform: 'generic',
    tags: ['测试', 'TDD', 'jest'],
    isBuiltIn: true,
    isFavorite: false,
    isShared: false,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    author: 'PromptFlow',
    versions: [],
  },
];
