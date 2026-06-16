import Foundation

/// 铃声项目数据模型
struct RingtoneProject: Identifiable, Codable {
    let id: UUID
    var name: String
    var sourceURL: URL
    var totalDuration: TimeInterval
    var startTime: TimeInterval
    var endTime: TimeInterval
    var fadeInDuration: TimeInterval
    var fadeOutDuration: TimeInterval
    var createdAt: Date
    var exportedAt: Date?

    /// 裁剪后的有效时长
    var trimmedDuration: TimeInterval {
        endTime - startTime
    }

    /// 是否在 iOS 铃声限制内（40 秒）
    var isWithinLimit: Bool {
        trimmedDuration <= Constants.maxRingtoneDuration && trimmedDuration >= Constants.minRingtoneDuration
    }

    /// 源文件名（不含扩展名）
    var sourceFileName: String {
        sourceURL.deletingPathExtension().lastPathComponent
    }

    /// 导出文件名
    var exportFileName: String {
        "\(name).\(Constants.exportFileExtension)"
    }

    init(
        id: UUID = UUID(),
        name: String = "",
        sourceURL: URL,
        totalDuration: TimeInterval,
        startTime: TimeInterval = 0,
        endTime: TimeInterval? = nil,
        fadeInDuration: TimeInterval = 0,
        fadeOutDuration: TimeInterval = 0,
        createdAt: Date = Date(),
        exportedAt: Date? = nil
    ) {
        self.id = id
        self.sourceURL = sourceURL
        self.totalDuration = totalDuration

        let effectiveEnd = min(endTime ?? totalDuration, totalDuration)
        let clampedEnd = min(effectiveEnd, startTime + Constants.maxRingtoneDuration)

        self.name = name.isEmpty ? sourceURL.deletingPathExtension().lastPathComponent : name
        self.startTime = startTime
        self.endTime = clampedEnd
        self.fadeInDuration = fadeInDuration
        self.fadeOutDuration = fadeOutDuration
        self.createdAt = createdAt
        self.exportedAt = exportedAt
    }
}

/// 波形数据，用于可视化
struct WaveformData {
    let samples: [Float]
    let duration: TimeInterval

    /// 空波形
    static let empty = WaveformData(samples: [], duration: 0)
}
