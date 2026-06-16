import SwiftUI

/// 付费解锁视图
/// 展示 Pro 版本功能并提供一次性购买入口
struct PaywallView: View {
    @EnvironmentObject var storeVM: StoreViewModel
    @EnvironmentObject var appState: AppState
    @Environment(\.dismiss) private var dismiss

    @State private var isPurchasing = false
    @State private var showError = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    headerSection
                    featuresSection
                    priceSection
                    purchaseButton
                    restoreButton
                    footerNote
                }
                .padding()
            }
            .navigationTitle("")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("关闭") { dismiss() }
                }
            }
            .alert("购买失败", isPresented: $showError) {
                Button("确定") {}
            } message: {
                Text(storeVM.errorMessage ?? "请稍后重试")
            }
        }
    }

    // MARK: - Sections

    private var headerSection: some View {
        VStack(spacing: 16) {
            Image(systemName: "star.circle.fill")
                .font(.system(size: 72))
                .foregroundStyle(
                    LinearGradient(
                        colors: [.rfPrimary, .rfSecondary],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )

            Text("升级到 Pro")
                .font(.largeTitle)
                .fontWeight(.bold)

            Text("一次购买，永久使用")
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
        .padding(.top, 20)
    }

    private var featuresSection: some View {
        VStack(spacing: 12) {
            FeatureRow(icon: "infinity", text: "无限铃声制作")
            FeatureRow(icon: "hand.raised.slash", text: "永无广告")
            FeatureRow(icon: "arrow.clockwise.circle", text: "终身免费更新")
            FeatureRow(icon: "waveform.badge.plus", text: "高级 Fade 效果")
        }
        .rfCardStyle()
    }

    private var priceSection: some View {
        VStack(spacing: 4) {
            Text(storeVM.priceText)
                .font(.system(size: 48, weight: .bold, design: .rounded))
                .foregroundStyle(
                    LinearGradient(
                        colors: [.rfPrimary, .rfSecondary],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )

            Text("一次性付费 · 无订阅")
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
        .padding(.vertical, 8)
    }

    private var purchaseButton: some View {
        Button {
            Task {
                isPurchasing = true
                let success = await storeVM.purchase()
                isPurchasing = false

                if success {
                    appState.unlockPro()
                    dismiss()
                } else if storeVM.errorMessage != nil {
                    showError = true
                }
            }
        } label: {
            HStack {
                if isPurchasing {
                    ProgressView()
                        .tint(.white)
                } else {
                    Image(systemName: "lock.open")
                }
                Text(isPurchasing ? "处理中..." : "立即解锁")
                    .fontWeight(.bold)
            }
            .font(.title3)
            .frame(maxWidth: .infinity)
            .rfGradientButton()
        }
        .disabled(isPurchasing || storeVM.isLoading)
    }

    private var restoreButton: some View {
        Button {
            Task {
                await storeVM.restorePurchases()
                if storeVM.isPurchased {
                    appState.unlockPro()
                    dismiss()
                }
            }
        } label: {
            Text("恢复购买")
                .font(.subheadline)
                .foregroundColor(.rfPrimary)
        }
    }

    private var footerNote: some View {
        Text("购买即同意服务条款和隐私政策。付款通过 Apple ID 处理。")
            .font(.caption2)
            .foregroundColor(.secondary)
            .multilineTextAlignment(.center)
            .padding(.top, 8)
    }
}

/// 功能行组件
struct FeatureRow: View {
    let icon: String
    let text: String

    var body: some View {
        HStack(spacing: 14) {
            Image(systemName: icon)
                .font(.body)
                .foregroundColor(.rfPrimary)
                .frame(width: 28)

            Text(text)
                .font(.body)

            Spacer()

            Image(systemName: "checkmark")
                .font(.caption)
                .foregroundColor(.rfSuccess)
        }
    }
}
