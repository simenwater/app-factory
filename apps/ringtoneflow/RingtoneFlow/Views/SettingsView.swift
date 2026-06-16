import SwiftUI

/// 设置视图
struct SettingsView: View {
    @EnvironmentObject var appState: AppState
    @EnvironmentObject var storeVM: StoreViewModel
    @State private var showPaywall = false

    var body: some View {
        NavigationStack {
            List {
                appearanceSection
                purchaseSection
                aboutSection
            }
            .navigationTitle("设置")
            .sheet(isPresented: $showPaywall) {
                PaywallView()
            }
        }
    }

    // MARK: - Sections

    private var appearanceSection: some View {
        Section("外观") {
            Toggle(isOn: $appState.prefersDarkMode) {
                Label("深色模式", systemImage: "moon.circle")
            }
            .tint(.rfPrimary)
        }
    }

    private var purchaseSection: some View {
        Section("购买") {
            if appState.isPurchased {
                HStack {
                    Label("Pro 版本", systemImage: "star.circle.fill")
                    Spacer()
                    Text("已解锁")
                        .foregroundColor(.rfSuccess)
                }
            } else {
                HStack {
                    Label("免费导出次数", systemImage: "arrow.down.circle")
                    Spacer()
                    Text("\(appState.remainingFreeExports) / \(Constants.freeExportLimit)")
                        .foregroundColor(.secondary)
                }

                Button {
                    showPaywall = true
                } label: {
                    Label("升级到 Pro", systemImage: "star.circle")
                        .foregroundColor(.rfPrimary)
                }

                Button {
                    Task { await storeVM.restorePurchases() }
                } label: {
                    Label("恢复购买", systemImage: "arrow.clockwise")
                        .foregroundColor(.rfPrimary)
                }
            }
        }
    }

    private var aboutSection: some View {
        Section("关于") {
            HStack {
                Label("版本", systemImage: "info.circle")
                Spacer()
                Text("1.0.0")
                    .foregroundColor(.secondary)
            }

            Link(destination: URL(string: "https://ringtoneflow.app/privacy")!) {
                Label("隐私政策", systemImage: "hand.raised")
            }

            Link(destination: URL(string: "https://ringtoneflow.app/terms")!) {
                Label("服务条款", systemImage: "doc.text")
            }

            HStack {
                Label("联系我们", systemImage: "envelope")
                Spacer()
                Text("support@ringtoneflow.app")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
    }
}
