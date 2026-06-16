import SwiftUI
import UniformTypeIdentifiers

/// 首页视图 —— 导入音频入口
struct HomeView: View {
    @EnvironmentObject var appState: AppState
    @EnvironmentObject var storeVM: StoreViewModel
    @StateObject private var editorVM = AudioEditorViewModel()
    @State private var showFilePicker = false
    @State private var showEditor = false
    @State private var showPaywall = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    headerSection
                    importSection
                    statusSection
                    quickTipsSection
                }
                .padding()
            }
            .navigationTitle("RingtoneFlow")
            .sheet(isPresented: $showFilePicker) {
                AudioDocumentPicker { url in
                    Task {
                        await editorVM.loadAudio(from: url)
                        if editorVM.project != nil {
                            showEditor = true
                        }
                    }
                }
            }
            .fullScreenCover(isPresented: $showEditor) {
                EditorView(viewModel: editorVM)
            }
            .sheet(isPresented: $showPaywall) {
                PaywallView()
            }
        }
    }

    // MARK: - Sections

    private var headerSection: some View {
        VStack(spacing: 8) {
            Image(systemName: "waveform.circle.fill")
                .font(.system(size: 64))
                .foregroundStyle(
                    LinearGradient(
                        colors: [.rfPrimary, .rfSecondary],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )

            Text("制作你的 iPhone 铃声")
                .font(.title2)
                .fontWeight(.bold)

            Text("导入音乐 → 裁剪 → 导出")
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
        .padding(.top, 20)
    }

    private var importSection: some View {
        Button {
            showFilePicker = true
        } label: {
            HStack(spacing: 16) {
                Image(systemName: "plus.circle.fill")
                    .font(.system(size: 36))

                VStack(alignment: .leading, spacing: 4) {
                    Text("导入音频文件")
                        .font(.headline)
                    Text("支持 MP3、M4A、WAV、AIFF 格式")
                        .font(.caption)
                        .foregroundColor(.white.opacity(0.8))
                }

                Spacer()

                Image(systemName: "chevron.right")
                    .font(.body)
                    .foregroundColor(.white.opacity(0.6))
            }
            .rfGradientButton()
        }
    }

    private var statusSection: some View {
        HStack(spacing: 16) {
            StatusCard(
                icon: "checkmark.circle",
                title: appState.isPurchased ? "Pro 已解锁" : "免费额度",
                value: appState.isPurchased ? "无限" : "\(appState.remainingFreeExports) 次",
                color: appState.isPurchased ? .rfSuccess : .rfPrimary
            )

            if !appState.isPurchased {
                StatusCard(
                    icon: "star.circle",
                    title: "升级 Pro",
                    value: storeVM.priceText,
                    color: .rfSecondary
                )
                .onTapGesture { showPaywall = true }
            }
        }
    }

    private var quickTipsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("快速指南")
                .font(.headline)

            ForEach(tips, id: \.title) { tip in
                HStack(alignment: .top, spacing: 12) {
                    Image(systemName: tip.icon)
                        .foregroundColor(.rfPrimary)
                        .frame(width: 24)

                    VStack(alignment: .leading, spacing: 2) {
                        Text(tip.title)
                            .font(.subheadline)
                            .fontWeight(.medium)
                        Text(tip.description)
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
            }
        }
        .rfCardStyle()
    }

    private let tips: [(icon: String, title: String, description: String)] = [
        ("music.note", "选择音乐", "从文件 App 导入你喜欢的歌曲"),
        ("scissors", "裁剪片段", "拖动波形选择最多 40 秒的精华部分"),
        ("square.and.arrow.up", "导出铃声", "保存为 .m4r 格式，按教程设置为铃声")
    ]
}

/// 状态卡片组件
struct StatusCard: View {
    let icon: String
    let title: String
    let value: String
    let color: Color

    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(color)

            Text(title)
                .font(.caption)
                .foregroundColor(.secondary)

            Text(value)
                .font(.title3)
                .fontWeight(.bold)
                .foregroundColor(color)
        }
        .frame(maxWidth: .infinity)
        .rfCardStyle()
    }
}

/// 音频文件选择器
struct AudioDocumentPicker: UIViewControllerRepresentable {
    let onPick: (URL) -> Void

    func makeUIViewController(context: Context) -> UIDocumentPickerViewController {
        let types: [UTType] = [.audio, .mp3, .mpeg4Audio, .aiff, .wav]
        let picker = UIDocumentPickerViewController(forOpeningContentTypes: types)
        picker.delegate = context.coordinator
        picker.allowsMultipleSelection = false
        return picker
    }

    func updateUIViewController(_ uiViewController: UIDocumentPickerViewController, context: Context) {}

    func makeCoordinator() -> Coordinator {
        Coordinator(onPick: onPick)
    }

    class Coordinator: NSObject, UIDocumentPickerDelegate {
        let onPick: (URL) -> Void

        init(onPick: @escaping (URL) -> Void) {
            self.onPick = onPick
        }

        func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {
            guard let url = urls.first else { return }
            onPick(url)
        }
    }
}
