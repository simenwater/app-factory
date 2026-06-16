import AVFoundation
import Foundation

/// 音频处理核心服务
/// 负责音频加载、波形提取、裁剪和 Fade 效果处理
class AudioService {
    /// 错误类型定义
    enum AudioError: LocalizedError {
        case fileNotFound
        case invalidFormat
        case readFailed
        case processingFailed(String)
        case exportFailed(String)
        case durationTooLong
        case durationTooShort

        var errorDescription: String? {
            switch self {
            case .fileNotFound:
                return "找不到音频文件"
            case .invalidFormat:
                return "不支持的音频格式"
            case .readFailed:
                return "无法读取音频文件"
            case .processingFailed(let detail):
                return "音频处理失败：\(detail)"
            case .exportFailed(let detail):
                return "导出失败：\(detail)"
            case .durationTooLong:
                return "铃声时长不能超过 \(Int(Constants.maxRingtoneDuration)) 秒"
            case .durationTooShort:
                return "铃声时长太短"
            }
        }
    }

    /// 从文件 URL 加载音频并获取时长
    /// - Parameter url: 音频文件 URL
    /// - Returns: 音频时长（秒）
    func getAudioDuration(url: URL) async throws -> TimeInterval {
        let asset = AVURLAsset(url: url)
        let duration = try await asset.load(.duration)
        return CMTimeGetSeconds(duration)
    }

    /// 提取波形数据
    /// - Parameters:
    ///   - url: 音频文件 URL
    ///   - sampleCount: 采样点数量
    /// - Returns: 归一化的波形数据
    func extractWaveform(from url: URL, sampleCount: Int = Constants.waveformSampleCount) async throws -> WaveformData {
        let file: AVAudioFile
        do {
            file = try AVAudioFile(forReading: url)
        } catch {
            throw AudioError.readFailed
        }

        let format = file.processingFormat
        let frameCount = UInt32(file.length)

        guard frameCount > 0 else {
            throw AudioError.invalidFormat
        }

        guard let buffer = AVAudioPCMBuffer(pcmFormat: format, frameCapacity: frameCount) else {
            throw AudioError.readFailed
        }

        try file.read(into: buffer)

        guard let channelData = buffer.floatChannelData?[0] else {
            throw AudioError.readFailed
        }

        let samplesPerBin = Int(frameCount) / sampleCount
        var samples = [Float]()

        for i in 0..<sampleCount {
            let startSample = i * samplesPerBin
            let endSample = min(startSample + samplesPerBin, Int(frameCount))

            var maxAmplitude: Float = 0
            for j in startSample..<endSample {
                let amplitude = abs(channelData[j])
                if amplitude > maxAmplitude {
                    maxAmplitude = amplitude
                }
            }
            samples.append(maxAmplitude)
        }

        // 归一化
        let peak = samples.max() ?? 1.0
        if peak > 0 {
            samples = samples.map { $0 / peak }
        }

        let duration = Double(frameCount) / format.sampleRate
        return WaveformData(samples: samples, duration: duration)
    }

    /// 裁剪并应用 Fade 效果后导出
    /// - Parameter project: 铃声项目配置
    /// - Returns: 导出文件的 URL
    func exportRingtone(project: RingtoneProject) async throws -> URL {
        guard project.isWithinLimit else {
            if project.trimmedDuration > Constants.maxRingtoneDuration {
                throw AudioError.durationTooLong
            }
            throw AudioError.durationTooShort
        }

        let asset = AVURLAsset(url: project.sourceURL)
        let startCMTime = CMTime(seconds: project.startTime, preferredTimescale: 44100)
        let endCMTime = CMTime(seconds: project.endTime, preferredTimescale: 44100)
        let timeRange = CMTimeRange(start: startCMTime, end: endCMTime)

        guard let exportSession = AVAssetExportSession(
            asset: asset,
            presetName: AVAssetExportPresetAppleM4A
        ) else {
            throw AudioError.exportFailed("无法创建导出会话")
        }

        let outputURL = FileManager.default.temporaryDirectory
            .appendingPathComponent(project.name)
            .appendingPathExtension(Constants.exportFileExtension)

        // 删除已存在的文件
        try? FileManager.default.removeItem(at: outputURL)

        exportSession.outputURL = outputURL
        exportSession.outputFileType = .m4a
        exportSession.timeRange = timeRange

        // 应用 Fade In/Out 音频参数
        if project.fadeInDuration > 0 || project.fadeOutDuration > 0 {
            let audioMix = createFadeMix(
                asset: asset,
                startTime: project.startTime,
                endTime: project.endTime,
                fadeIn: project.fadeInDuration,
                fadeOut: project.fadeOutDuration
            )
            exportSession.audioMix = audioMix
        }

        await exportSession.export()

        switch exportSession.status {
        case .completed:
            return outputURL
        case .failed:
            throw AudioError.exportFailed(exportSession.error?.localizedDescription ?? "未知错误")
        case .cancelled:
            throw AudioError.exportFailed("导出被取消")
        default:
            throw AudioError.exportFailed("未知导出状态")
        }
    }

    /// 创建 Fade In/Out 音频混合参数
    private func createFadeMix(
        asset: AVAsset,
        startTime: TimeInterval,
        endTime: TimeInterval,
        fadeIn: TimeInterval,
        fadeOut: TimeInterval
    ) -> AVAudioMix {
        let audioMix = AVMutableAudioMix()
        var params = [AVMutableAudioMixInputParameters]()

        let tracks = asset.tracks(withMediaType: .audio)
        for track in tracks {
            let inputParams = AVMutableAudioMixInputParameters(track: track)

            // Fade In
            if fadeIn > 0 {
                let fadeInStart = CMTime(seconds: startTime, preferredTimescale: 44100)
                let fadeInEnd = CMTime(seconds: startTime + fadeIn, preferredTimescale: 44100)
                inputParams.setVolumeRamp(
                    fromStartVolume: 0.0,
                    toEndVolume: 1.0,
                    timeRange: CMTimeRange(start: fadeInStart, end: fadeInEnd)
                )
            }

            // Fade Out
            if fadeOut > 0 {
                let fadeOutStart = CMTime(seconds: endTime - fadeOut, preferredTimescale: 44100)
                let fadeOutEnd = CMTime(seconds: endTime, preferredTimescale: 44100)
                inputParams.setVolumeRamp(
                    fromStartVolume: 1.0,
                    toEndVolume: 0.0,
                    timeRange: CMTimeRange(start: fadeOutStart, end: fadeOutEnd)
                )
            }

            params.append(inputParams)
        }

        audioMix.inputParameters = params
        return audioMix
    }

    /// 将导出文件复制到可共享的文档目录
    /// - Parameters:
    ///   - sourceURL: 临时文件 URL
    ///   - fileName: 目标文件名
    /// - Returns: 文档目录中的文件 URL
    func copyToDocuments(from sourceURL: URL, fileName: String) throws -> URL {
        let documentsURL = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
        let destinationURL = documentsURL.appendingPathComponent(fileName)

        try? FileManager.default.removeItem(at: destinationURL)
        try FileManager.default.copyItem(at: sourceURL, to: destinationURL)

        return destinationURL
    }
}
