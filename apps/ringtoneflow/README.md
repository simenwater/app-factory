# RingtoneFlow

极简 iPhone 铃声制作工具 —— 告别 GarageBand 的复杂操作，无广告、无订阅。

## 功能特性

- **音频导入**：支持 MP3、M4A、WAV、AIFF 格式，从「文件」App 直接导入
- **波形可视化裁剪**：可视化波形编辑器，拖拽手柄精准选择片段（最长 40 秒）
- **Fade In/Out**：内置渐入渐出效果，最长 5 秒
- **一键导出**：导出为 .m4r 格式到「文件」App，附带铃声设置教程
- **深色模式**：完整的深色模式支持
- **无广告 · 无订阅**：一次性付费 $4.99，前 3 次导出完全免费

## 技术栈

- **UI 框架**：SwiftUI (iOS 17+)
- **音频处理**：AVFoundation / AVAudioEngine
- **内购**：StoreKit 2
- **架构**：MVVM

## 项目结构

```
RingtoneFlow/
├── RingtoneFlowApp.swift          # App 入口
├── Models/
│   ├── RingtoneProject.swift      # 铃声项目数据模型
│   └── AppState.swift             # 全局状态管理
├── Views/
│   ├── ContentView.swift          # 主 Tab 导航 + 引导页
│   ├── HomeView.swift             # 首页（导入入口）
│   ├── EditorView.swift           # 音频编辑器
│   ├── WaveformView.swift         # 波形可视化组件
│   ├── ExportView.swift           # 导出成功 + 设置教程
│   ├── PaywallView.swift          # 付费解锁页
│   └── SettingsView.swift         # 设置页
├── ViewModels/
│   ├── AudioEditorViewModel.swift # 编辑器视图模型
│   └── StoreViewModel.swift       # 内购视图模型
├── Services/
│   ├── AudioService.swift         # 音频加载/波形提取/裁剪导出
│   ├── FileExportService.swift    # 文件管理与导出
│   └── StoreService.swift         # StoreKit 2 内购服务
├── Utilities/
│   ├── Constants.swift            # 全局常量
│   └── Extensions.swift           # Swift 扩展
└── Configuration.storekit         # StoreKit 测试配置

RingtoneFlowTests/
├── RingtoneProjectTests.swift     # 数据模型测试
├── AppStateTests.swift            # 状态管理测试
├── ConstantsTests.swift           # 常量配置测试
└── TimeIntervalExtensionTests.swift # 时间格式化测试
```

## 开发环境

- Xcode 15.4+
- iOS 17.0+
- Swift 5.9+

## 开始开发

1. 使用 Xcode 打开 `RingtoneFlow.xcodeproj`
2. 选择 iPhone 模拟器或真机
3. 运行项目 (⌘R)
4. 内购测试：在 Scheme 设置中选择 `Configuration.storekit` 作为 StoreKit Configuration

## 变现策略

- **免费试用**：前 3 次铃声导出完全免费
- **一次性付费**：$4.99 永久解锁无限铃声制作
- **无广告**：全程零广告体验
- **无订阅**：一次购买，终身使用

## License

MIT
