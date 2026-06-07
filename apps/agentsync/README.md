# AgentSync

> 一个标准化的 AI 代理配置文件格式（AGENTS.md）的跨平台支持工具，让不同 AI 编码工具能共享项目理解。

## 功能特性

- **一键识别** — 自动扫描项目中所有 AI 工具配置文件（CLAUDE.md、.cursorrules、copilot-instructions.md、.windsurfrules）
- **格式转换** — 将任意 AI 配置文件转换为标准 AGENTS.md 格式
- **智能合并** — 多来源配置文件合并，自动检测冲突与去重
- **CLI 支持** — 完整的命令行工具，支持 scan / convert / merge / init / status 命令
- **付费功能框架** — 内置订阅制变现基础设施（团队同步、自定义模板等）

## 支持的配置格式

| 工具 | 配置文件 |
|------|----------|
| Claude (Anthropic) | `CLAUDE.md` |
| Cursor | `.cursorrules` |
| GitHub Copilot | `.github/copilot-instructions.md` |
| Windsurf | `.windsurfrules` |

## 快速开始

### 安装

```bash
npm install -g agentsync
```

### 使用

```bash
# 扫描项目中的 AI 配置文件
agentsync scan

# 将 CLAUDE.md 转换为 AGENTS.md
agentsync convert CLAUDE.md

# 合并所有检测到的配置文件
agentsync merge

# 初始化新的 AGENTS.md
agentsync init

# 查看同步状态
agentsync status
```

## CLI 命令

### `agentsync scan [dir]`

扫描项目目录，列出所有检测到的 AI 配置文件。

```bash
agentsync scan .
agentsync scan --json  # JSON 格式输出
```

### `agentsync convert <file>`

将指定的 AI 配置文件转换为 AGENTS.md 格式。

```bash
agentsync convert CLAUDE.md
agentsync convert .cursorrules -o custom-output.md
agentsync convert CLAUDE.md --dry-run  # 预览不写入
```

### `agentsync merge [dir]`

自动检测并合并项目中所有 AI 配置文件为统一的 AGENTS.md。

```bash
agentsync merge
agentsync merge --show-conflicts  # 显示冲突详情
agentsync merge --dry-run         # 预览合并结果
```

### `agentsync init [dir]`

从模板创建新的 AGENTS.md 文件。

```bash
agentsync init
agentsync init --force  # 覆盖已存在的文件
```

### `agentsync status [dir]`

显示项目配置文件的同步状态。

## AGENTS.md 标准格式

```markdown
# Project Name

> Project description

---
version: 1.0.0
generated: 2024-01-01T00:00:00.000Z
sources: CLAUDE.md, .cursorrules
---

## Tech Stack

- TypeScript
- React

## Code Style & Formatting

- Use 2-space indentation
- Prefer const over let

## Testing

- Write unit tests for all business logic
```

## 开发

```bash
# 安装依赖
npm install

# 编译
npm run build

# 运行测试
npm test

# 开发模式 (watch)
npm run dev
```

## 项目结构

```
apps/agentsync/
├── src/
│   ├── core/           # 核心类型、转换器、合并引擎
│   ├── parsers/        # 各平台配置文件解析器
│   ├── formatters/     # AGENTS.md 输出格式化器
│   ├── cli/            # CLI 命令行入口与子命令
│   └── utils/          # 工具函数与订阅管理
├── tests/              # 单元测试
├── package.json
└── tsconfig.json
```

## 变现计划

| 功能 | Free | Pro ($5/月) |
|------|------|-------------|
| 基础转换 | ✓ | ✓ |
| 来源文件数 | ≤ 3 | 无限制 |
| 团队同步 | ✗ | ✓ |
| 自定义模板 | ✗ | ✓ |
| 冲突自动解决 | ✗ | ✓ |
| Watch 模式 | ✗ | ✓ |

年付 $50/年（节省 17%）。

## License

MIT
