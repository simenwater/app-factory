import SwiftUI
import AVFoundation
import Combine

/// 音频编辑器视图模型
/// 管理音频播放、裁剪区间、Fade 参数和波形数据
@MainActor
class AudioEditorViewModel: ObservableObject {
    // MARK: - Published Properties

    /// 当前编辑的项目
    @Published var project: RingtoneProject?

    /// 波形数据
    @Published var waveformData: WaveformData = .empty

    /// 裁剪起始位置（比例 0~1）
    @Published var trimStartRatio: CGFloat = 0

    /// 裁剪结束位置（比例 0~1）
    @Published var trimEndRatio: CGFloat = 1

    /// Fade In 时长
    @Published var fadeInDuration: TimeInterval = 0

    /// Fade Out 时长
    @Published var fadeOutDuration: TimeInterval = 0

    /// 是否正在播放
    @Published var isPlaying: Bool = false

    /// 当前播放位置（比例 0~1）
    @Published var playbackPosition: CGFloat = 0

    /// 加载状态
    @Published var isLoading: Bool = false

    /// 错误消息
    @Published var errorMessage: String?

    /// 是否正在导出
    @Published var isExporting: Bool = false

    /// 导出成功的 URL
    @Published var exportedURL: URL?

    /// 是否显示导出教程
    @Published var showTutorial: Bool = false

    // MARK: - Private Properties

    private let audioService = AudioService()
    private let fileExportService = FileExportService()
    private var audioPlayer: AVAudioPlayer?
    private var playbackTimer: Timer?

    // MARK: - Computed Properties

    /// 裁剪起始时间（秒）
    var startTime: TimeInterval {
        guard let project = project else { return 0 }
        return Double(trimStartRatio) * project.totalDuration
    }

    /// 裁剪结束时间（秒）
    var endTime: TimeInterval {
        guard let project = project else { return 0 }
        return Double(trimEndRatio) * project.totalDuration
    }

    /// 选定片段时长
    var selectedDuration: TimeInterval {
        endTime - startTime
    }

    /// 是否时长合规
    var isDurationValid: Bool {
        selectedDuration >= Constants.minRingtoneDuration &&
        selectedDuration <= Constants.maxRingtoneDuration
    }

    /// 时长警告信息
    var durationWarning: String? {
        if selectedDuration > Constants.maxRingtoneDuration {
            return "铃声最长 \(Int(Constants.maxRingtoneDuration)) 秒，当前 \(selectedDuration.formattedTime)"
        }
        if selectedDuration < Constants.minRingtoneDuration {
            return "铃声太短，请拉长选区"
        }
        return nil
    }

    // MARK: - Audio Loading

    /// 从 URL 加载音频文件
    /// - Parameter url: 音频文件 URL
    func loadAudio(from url: URL) async {
        isLoading = true
        errorMessage = nil

        do {
            // 开始安全访问
            let accessing = url.startAccessingSecurityScopedResource()
            defer {
                if accessing { url.stopAccessingSecurityScopedResource() }
            }

            // 复制到临时目录确保持续访问
            let tempURL = FileManager.default.temporaryDirectory
                .appendingPathComponent(url.lastPathComponent)
            try? FileManager.default.removeItem(at: tempURL)
            try FileManager.default.copyItem(at: url, to: tempURL)

            let duration = try await audioService.getAudioDuration(url: tempURL)
            let waveform = try await audioService.extractWaveform(from: tempURL)

            let defaultEnd = min(duration, Constants.maxRingtoneDuration)

            project = RingtoneProject(
                sourceURL: tempURL,
                totalDuration: duration,
                endTime: defaultEnd
            )

            waveformData = waveform
            trimStartRatio = 0
            trimEndRatio = CGFloat(defaultEnd / duration)

        } catch {
            errorMessage = "加载失败：\(error.localizedDescription)"
        }

        isLoading = false
    }

    // MARK: - Playback

    /// 播放/暂停切换
    func togglePlayback() {
        if isPlaying {
            stopPlayback()
        } else {
            startPlayback()
        }
    }

    /// 开始播放选定片段
    func startPlayback() {
        guard let project = project else { return }

        do {
            try AVAudioSession.sharedInstance().setCategory(.playback)
            try AVAudioSession.sharedInstance().setActive(true)

            audioPlayer = try AVAudioPlayer(contentsOf: project.sourceURL)
            audioPlayer?.currentTime = startTime
            audioPlayer?.play()
            isPlaying = true

            playbackTimer = Timer.scheduledTimer(withTimeInterval: 0.05, repeats: true) { [weak self] _ in
                Task { @MainActor [weak self] in
                    guard let self = self else { return }
                    self.updatePlaybackPosition()
                }
            }
        } catch {
            errorMessage = "播放失败：\(error.localizedDescription)"
        }
    }

    /// 停止播放
    func stopPlayback() {
        audioPlayer?.stop()
        audioPlayer = nil
        playbackTimer?.invalidate()
        playbackTimer = nil
        isPlaying = false
        playbackPosition = trimStartRatio
    }

    /// 更新播放进度
    private func updatePlaybackPosition() {
        guard let player = audioPlayer, let project = project else { return }

        let currentTime = player.currentTime
        playbackPosition = CGFloat(currentTime / project.totalDuration)

        if currentTime >= endTime {
            stopPlayback()
        }
    }

    // MARK: - Trim Controls

    /// 更新裁剪起始点
    /// - Parameter ratio: 比例值 (0~1)
    func updateTrimStart(_ ratio: CGFloat) {
        let clamped = max(0, min(ratio, trimEndRatio - CGFloat(Constants.minRingtoneDuration / (project?.totalDuration ?? 1))))
        trimStartRatio = clamped
    }

    /// 更新裁剪结束点
    /// - Parameter ratio: 比例值 (0~1)
    func updateTrimEnd(_ ratio: CGFloat) {
        let clamped = min(1, max(ratio, trimStartRatio + CGFloat(Constants.minRingtoneDuration / (project?.totalDuration ?? 1))))
        trimEndRatio = clamped
    }

    // MARK: - Export

    /// 导出铃声
    /// - Parameter appState: 应用状态（用于计数和权限检查）
    func exportRingtone(appState: AppState) async {
        guard var project = project else { return }

        isExporting = true
        errorMessage = nil

        project.startTime = startTime
        project.endTime = endTime
        project.fadeInDuration = fadeInDuration
        project.fadeOutDuration = fadeOutDuration

        do {
            let exportedFile = try await audioService.exportRingtone(project: project)
            let shareableURL = try fileExportService.prepareForSharing(
                url: exportedFile,
                name: project.name
            )

            exportedURL = shareableURL
            appState.recordExport()
            showTutorial = true

        } catch {
            errorMessage = "导出失败：\(error.localizedDescription)"
        }

        isExporting = false
    }

    /// 更新项目名称
    /// - Parameter name: 新名称
    func updateName(_ name: String) {
        project?.name = name
    }

    /// 清理资源
    func cleanup() {
        stopPlayback()
        project = nil
        waveformData = .empty
        exportedURL = nil
    }
}
