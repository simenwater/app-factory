# App Factory

AI 驱动的 App 批量生产工厂。

## 工作流程

1. **需求发现管线**（服务器每6小时自动运行）→ 从 Reddit/HN/App Store/Google Trends 采集信号
2. **AI 分析**（DeepSeek 提取 + Qwen3.5 打分）→ 筛选 GO 级别机会
3. **自动创建 Issue**（带完整 App 规格）→ Cursor Cloud Agent 接单
4. **AI 写代码** → 生成 PR
5. **人工审核** → 合并 + 上架

## Issue 标签

- `app-opportunity`: 需求发现管线自动创建的机会
- `go`: 评分 > 7 的高优先级机会
- `building`: Cursor Agent 正在开发
- `ready`: PR 已就绪，等待审核
