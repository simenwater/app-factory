# PedalLink Pro

专为 iOS 音乐人设计的 MIDI 脚踏板映射工具。将物理脚踏板信号转化为 AUM 等宿主软件的通道控制指令，无需复杂设置，即连即用。

## 核心功能

- **MIDI CC 信号监听与识别** — 实时监控所有连接的 MIDI 设备，解析 CC、Note On/Off、Program Change 消息
- **自定义脚踏动作映射** — 将任意 MIDI 信号映射为静音、独奏、通道选择、音量控制等操作
- **AUM 及主流宿主互联** — 通过虚拟 MIDI 端口和 URL Scheme 与 AUM、Audiobus、GarageBand 等深度互联
- **MIDI Learn 学习模式** — 踩下踏板自动识别信号，无需手动输入 CC 编号
- **预设系统** — 内置常见脚踏板配置预设，一键加载

## 技术架构

```
PedalLinkPro/
├── App/                    # 应用入口
├── Models/                 # 数据模型
│   ├── MIDIMessage.swift   # MIDI 消息模型
│   ├── MIDIMapping.swift   # 映射规则模型
│   └── HostAction.swift    # 宿主操作模型
├── Services/               # 服务层
│   ├── MIDIService.swift   # CoreMIDI 服务（输入监听）
│   ├── MappingEngine.swift # 映射引擎（核心逻辑）
│   ├── HostInteropService.swift # 宿主互联服务（MIDI 输出 + URL Scheme）
│   └── StoreKitService.swift    # StoreKit 2 购买服务
├── ViewModels/             # 视图模型
├── Views/                  # SwiftUI 视图
│   ├── MIDIMonitorView     # MIDI 实时监视器
│   ├── MappingListView     # 映射规则列表
│   ├── MappingDetailView   # 映射编辑（含 MIDI Learn）
│   ├── SettingsView        # 设置与购买
│   └── Components/         # 可复用 UI 组件
├── Utilities/              # 工具类
└── Resources/              # 资源文件
```

## 技术要点

| 模块 | 技术 |
|------|------|
| MIDI 输入 | CoreMIDI + MIDI 1.0 UMP 协议 |
| MIDI 输出 | 虚拟 MIDI Source（MIDISourceCreateWithProtocol） |
| AUM 控制 | URL Scheme (`aum://control`) + MIDI CC |
| 映射索引 | 字典哈希 O(1) 查找 |
| 持久化 | UserDefaults + Codable |
| 付费 | StoreKit 2（一次性买断 $9.99） |
| UI | SwiftUI + 深色模式 |
| 最低版本 | iOS 17.0 |

## 开发环境

- Xcode 15.4+
- iOS 17.0+ SDK
- Swift 5.9+

## 构建与运行

1. 用 Xcode 打开 `PedalLinkPro.xcodeproj`
2. 选择目标设备（推荐真机测试 MIDI 功能）
3. 配置 Signing & Capabilities 中的开发者团队
4. Build & Run

## 变现模式

一次性付费 $9.99，解锁全部功能，终身免费更新。免费版限制最多 3 个映射规则。

## 测试

项目包含完整的单元测试覆盖核心逻辑：

- `MIDIMessageTests` — MIDI 消息模型测试
- `MappingEngineTests` — 映射引擎匹配与 CRUD 测试
- `HostInteropServiceTests` — 宿主操作与编解码测试
