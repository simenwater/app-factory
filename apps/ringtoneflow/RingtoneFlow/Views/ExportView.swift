import SwiftUI

/// 导出成功与设置教程视图
struct ExportView: View {
    let exportedURL: URL
    let ringtoneName: String
    @Environment(\.dismiss) private var dismiss

    @State private var showShareSheet = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    successHeader
                    shareSection
                    tutorialSection
                }
                .padding()
            }
            .navigationTitle("导出成功")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("完成") { dismiss() }
                }
            }
        }
    }

    // MARK: - Sections

    /// 成功头部
    private var successHeader: some View {
        VStack(spacing: 16) {
            Image(systemName: "checkmark.circle.fill")
                .font(.system(size: 64))
                .foregroundColor(.rfSuccess)

            Text("铃声已导出！")
                .font(.title2)
                .fontWeight(.bold)

            Text(ringtoneName)
                .font(.subheadline)
                .foregroundColor(.secondary)
                .padding(.horizontal, 16)
                .padding(.vertical, 6)
                .background(Color.rfCardBackground)
                .cornerRadius(8)
        }
        .padding(.top, 20)
    }

    /// 分享/保存到文件按钮
    private var shareSection: some View {
        VStack(spacing: 12) {
            ShareLink(item: exportedURL) {
                HStack {
                    Image(systemName: "square.and.arrow.up")
                    Text("保存到「文件」App")
                        .fontWeight(.semibold)
                }
                .frame(maxWidth: .infinity)
                .rfGradientButton()
            }

            Text("将 .m4r 文件保存到「文件」App 后，按以下步骤设置为铃声")
                .font(.caption)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
        }
    }

    /// 设置教程
    private var tutorialSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("如何设置为铃声")
                .font(.headline)

            ForEach(Array(FileExportService.setupTutorialSteps.enumerated()), id: \.offset) { _, step in
                TutorialStepRow(
                    icon: step.icon,
                    title: step.title,
                    description: step.description
                )
            }

            alternativeMethodNote
        }
        .rfCardStyle()
    }

    /// 替代方法提示
    private var alternativeMethodNote: some View {
        VStack(alignment: .leading, spacing: 8) {
            Divider()

            HStack(alignment: .top, spacing: 8) {
                Image(systemName: "lightbulb")
                    .foregroundColor(.orange)

                Text("提示：iOS 16+ 用户也可以使用「快捷指令」App 中的自动化来简化设置流程。")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
    }
}

/// 教程步骤行组件
struct TutorialStepRow: View {
    let icon: String
    let title: String
    let description: String

    var body: some View {
        HStack(alignment: .top, spacing: 14) {
            Image(systemName: icon)
                .font(.title3)
                .foregroundColor(.rfPrimary)
                .frame(width: 28, height: 28)

            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.subheadline)
                    .fontWeight(.semibold)

                Text(description)
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
    }
}
