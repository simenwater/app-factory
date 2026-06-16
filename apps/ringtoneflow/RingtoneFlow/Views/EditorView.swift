import SwiftUI

/// 音频编辑器视图
/// 提供波形裁剪、Fade 控制和导出功能
struct EditorView: View {
    @ObservedObject var viewModel: AudioEditorViewModel
    @EnvironmentObject var appState: AppState
    @Environment(\.dismiss) private var dismiss

    @State private var showExportSheet = false
    @State private var showPaywall = false
    @State private var editingName = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    if viewModel.isLoading {
                        loadingView
                    } else if let _ = viewModel.project {
                        nameSection
                        waveformSection
                        timeInfoSection
                        fadeControlSection
                        playbackControls
                        exportButton
                    }
                }
                .padding()
            }
            .background(Color.rfBackground)
            .navigationTitle("编辑铃声")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("取消") {
                        viewModel.cleanup()
                        dismiss()
                    }
                }
            }
            .alert("错误", isPresented: Binding(
                get: { viewModel.errorMessage != nil },
                set: { if !$0 { viewModel.errorMessage = nil } }
            )) {
                Button("确定") { viewModel.errorMessage = nil }
            } message: {
                Text(viewModel.errorMessage ?? "")
            }
            .sheet(isPresented: $showExportSheet) {
                if let url = viewModel.exportedURL {
                    ExportView(
                        exportedURL: url,
                        ringtoneName: viewModel.project?.name ?? "铃声"
                    )
                }
            }
            .sheet(isPresented: $showPaywall) {
                PaywallView()
            }
            .onChange(of: viewModel.showTutorial) { _, newValue in
                if newValue {
                    showExportSheet = true
                    viewModel.showTutorial = false
                }
            }
        }
    }

    // MARK: - Sections

    /// 铃声名称编辑
    private var nameSection: some View {
        HStack {
            if editingName {
                TextField("铃声名称", text: Binding(
                    get: { viewModel.project?.name ?? "" },
                    set: { viewModel.updateName($0) }
                ))
                .textFieldStyle(.roundedBorder)
                .onSubmit { editingName = false }

                Button {
                    editingName = false
                } label: {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(.rfSuccess)
                }
            } else {
                Text(viewModel.project?.name ?? "")
                    .font(.title3)
                    .fontWeight(.semibold)

                Spacer()

                Button {
                    editingName = true
                } label: {
                    Image(systemName: "pencil.circle")
                        .foregroundColor(.rfPrimary)
                }
            }
        }
        .rfCardStyle()
    }

    /// 波形显示与裁剪
    private var waveformSection: some View {
        VStack(spacing: 12) {
            Text("拖动两侧手柄裁剪片段")
                .font(.caption)
                .foregroundColor(.secondary)

            WaveformView(
                waveformData: viewModel.waveformData,
                trimStartRatio: $viewModel.trimStartRatio,
                trimEndRatio: $viewModel.trimEndRatio,
                playbackPosition: viewModel.playbackPosition,
                isPlaying: viewModel.isPlaying,
                onTrimStartChanged: { viewModel.updateTrimStart($0) },
                onTrimEndChanged: { viewModel.updateTrimEnd($0) }
            )
            .rfCardStyle()
        }
    }

    /// 时间信息
    private var timeInfoSection: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text("起始")
                    .font(.caption)
                    .foregroundColor(.secondary)
                Text(viewModel.startTime.formattedTimePrecise)
                    .font(.system(.body, design: .monospaced))
                    .fontWeight(.medium)
            }

            Spacer()

            VStack(spacing: 4) {
                Text("时长")
                    .font(.caption)
                    .foregroundColor(.secondary)

                Text(viewModel.selectedDuration.formattedTime)
                    .font(.system(.title3, design: .monospaced))
                    .fontWeight(.bold)
                    .foregroundColor(viewModel.isDurationValid ? .rfPrimary : .rfError)
            }

            Spacer()

            VStack(alignment: .trailing, spacing: 4) {
                Text("结束")
                    .font(.caption)
                    .foregroundColor(.secondary)
                Text(viewModel.endTime.formattedTimePrecise)
                    .font(.system(.body, design: .monospaced))
                    .fontWeight(.medium)
            }
        }
        .rfCardStyle()
        .overlay {
            if let warning = viewModel.durationWarning {
                VStack {
                    Spacer()
                    Text(warning)
                        .font(.caption2)
                        .foregroundColor(.rfError)
                        .padding(.bottom, 4)
                }
            }
        }
    }

    /// Fade 控制
    private var fadeControlSection: some View {
        VStack(spacing: 16) {
            HStack {
                Text("淡入淡出效果")
                    .font(.headline)
                Spacer()
            }

            FadeControl(
                label: "Fade In",
                icon: "speaker.wave.1",
                duration: $viewModel.fadeInDuration,
                maxDuration: Constants.maxFadeDuration
            )

            FadeControl(
                label: "Fade Out",
                icon: "speaker.slash",
                duration: $viewModel.fadeOutDuration,
                maxDuration: Constants.maxFadeDuration
            )
        }
        .rfCardStyle()
    }

    /// 播放控制
    private var playbackControls: some View {
        HStack(spacing: 24) {
            Button {
                viewModel.stopPlayback()
            } label: {
                Image(systemName: "stop.circle.fill")
                    .font(.system(size: 36))
                    .foregroundColor(.secondary)
            }
            .disabled(!viewModel.isPlaying)

            Button {
                viewModel.togglePlayback()
            } label: {
                Image(systemName: viewModel.isPlaying ? "pause.circle.fill" : "play.circle.fill")
                    .font(.system(size: 56))
                    .foregroundStyle(
                        LinearGradient(
                            colors: [.rfPrimary, .rfSecondary],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
            }
        }
        .padding(.vertical, 8)
    }

    /// 导出按钮
    private var exportButton: some View {
        VStack(spacing: 8) {
            Button {
                if appState.canExport {
                    Task {
                        await viewModel.exportRingtone(appState: appState)
                    }
                } else {
                    showPaywall = true
                }
            } label: {
                HStack {
                    if viewModel.isExporting {
                        ProgressView()
                            .tint(.white)
                    } else {
                        Image(systemName: "square.and.arrow.up")
                    }
                    Text(viewModel.isExporting ? "导出中..." : "导出铃声")
                        .fontWeight(.semibold)
                }
                .frame(maxWidth: .infinity)
                .rfGradientButton()
            }
            .disabled(!viewModel.isDurationValid || viewModel.isExporting)
            .opacity(viewModel.isDurationValid ? 1 : 0.6)

            if !appState.isPurchased {
                Text("剩余 \(appState.remainingFreeExports) 次免费导出")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
    }

    /// 加载中
    private var loadingView: some View {
        VStack(spacing: 16) {
            ProgressView()
                .scaleEffect(1.5)

            Text("正在加载音频...")
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity, minHeight: 300)
    }
}

/// Fade 控制滑块组件
struct FadeControl: View {
    let label: String
    let icon: String
    @Binding var duration: TimeInterval
    let maxDuration: TimeInterval

    var body: some View {
        VStack(spacing: 4) {
            HStack {
                Image(systemName: icon)
                    .foregroundColor(.rfPrimary)
                    .frame(width: 24)

                Text(label)
                    .font(.subheadline)

                Spacer()

                Text(String(format: "%.1f 秒", duration))
                    .font(.system(.caption, design: .monospaced))
                    .foregroundColor(.secondary)
            }

            Slider(value: $duration, in: 0...maxDuration, step: 0.1)
                .tint(.rfPrimary)
        }
    }
}
