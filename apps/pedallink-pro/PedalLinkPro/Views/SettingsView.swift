import SwiftUI

/// 设置视图
///
/// 提供应用设置、设备管理、购买管理和关于信息。
struct SettingsView: View {
    @EnvironmentObject var midiService: MIDIService
    @EnvironmentObject var storeService: StoreKitService
    @AppStorage("hapticFeedback") private var hapticFeedback = true
    @AppStorage("autoConnect") private var autoConnect = true
    @AppStorage("showMIDIValues") private var showMIDIValues = true

    var body: some View {
        NavigationStack {
            List {
                deviceSection
                proSection
                preferencesSection
                aboutSection
            }
            .navigationTitle("设置")
        }
    }

    /// 设备管理
    private var deviceSection: some View {
        Section("MIDI 设备") {
            HStack {
                Image(systemName: midiService.isRunning ? "checkmark.circle.fill" : "xmark.circle.fill")
                    .foregroundColor(midiService.isRunning ? .green : .red)
                Text("MIDI 服务")
                Spacer()
                Text(midiService.isRunning ? "运行中" : "已停止")
                    .foregroundColor(.secondary)
            }

            ForEach(midiService.connectedSources) { source in
                HStack {
                    Image(systemName: "cable.connector")
                        .foregroundColor(.orange)
                    Text(source.name)
                    Spacer()
                    Image(systemName: "checkmark")
                        .foregroundColor(.green)
                        .font(.caption)
                }
            }

            if midiService.connectedSources.isEmpty {
                HStack {
                    Image(systemName: "exclamationmark.triangle")
                        .foregroundColor(.yellow)
                    Text("未检测到 MIDI 设备")
                        .foregroundColor(.secondary)
                }
            }

            Button {
                midiService.refreshDevices()
            } label: {
                Label("刷新设备", systemImage: "arrow.clockwise")
            }

            Toggle("自动连接新设备", isOn: $autoConnect)
        }
    }

    /// Pro 版购买
    private var proSection: some View {
        Section {
            if storeService.isProUnlocked {
                HStack {
                    Image(systemName: "crown.fill")
                        .foregroundColor(.orange)
                    Text("Pro 已解锁")
                        .fontWeight(.medium)
                    Spacer()
                    Text("感谢支持！")
                        .foregroundColor(.secondary)
                        .font(.caption)
                }
            } else {
                VStack(alignment: .leading, spacing: 8) {
                    HStack {
                        Image(systemName: "crown.fill")
                            .foregroundColor(.orange)
                        Text("升级到 Pro")
                            .fontWeight(.medium)
                    }

                    VStack(alignment: .leading, spacing: 4) {
                        FeatureRow(text: "无限映射规则")
                        FeatureRow(text: "自定义预设管理")
                        FeatureRow(text: "终身免费更新")
                    }
                    .padding(.leading, 4)

                    Button {
                        if let product = storeService.products.first {
                            Task { await storeService.purchase(product) }
                        }
                    } label: {
                        Text("一次性购买 \(storeService.proPriceString)")
                            .frame(maxWidth: .infinity)
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(.orange)

                    Button("恢复购买") {
                        Task { await storeService.restorePurchases() }
                    }
                    .font(.caption)
                    .frame(maxWidth: .infinity)
                }
            }
        } header: {
            Text("PedalLink Pro")
        }
    }

    /// 偏好设置
    private var preferencesSection: some View {
        Section("偏好设置") {
            Toggle("触感反馈", isOn: $hapticFeedback)
            Toggle("显示 MIDI 数值", isOn: $showMIDIValues)
        }
    }

    /// 关于信息
    private var aboutSection: some View {
        Section("关于") {
            HStack {
                Text("版本")
                Spacer()
                Text(AppConstants.appVersion)
                    .foregroundColor(.secondary)
            }
            HStack {
                Text("开发者")
                Spacer()
                Text("PedalLink Team")
                    .foregroundColor(.secondary)
            }
            Link(destination: URL(string: "https://pedallinkpro.com/support")!) {
                Label("帮助与支持", systemImage: "questionmark.circle")
            }
            Link(destination: URL(string: "https://pedallinkpro.com/privacy")!) {
                Label("隐私政策", systemImage: "hand.raised")
            }
        }
    }
}

/// Pro 功能列表行
struct FeatureRow: View {
    let text: String

    var body: some View {
        HStack(spacing: 6) {
            Image(systemName: "checkmark.circle.fill")
                .font(.caption)
                .foregroundColor(.orange)
            Text(text)
                .font(.caption)
                .foregroundColor(.secondary)
        }
    }
}
