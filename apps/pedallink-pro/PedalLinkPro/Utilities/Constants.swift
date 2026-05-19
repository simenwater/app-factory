import SwiftUI

/// 应用常量定义
enum AppConstants {
    /// 应用名称
    static let appName = "PedalLink Pro"
    /// 应用版本
    static let appVersion = "1.0.0"
    /// 最大映射数量（免费版限制）
    static let freeMaxMappings = 3
    /// 最大 MIDI 通道数
    static let maxMIDIChannels = 16
    /// 最大通道数
    static let maxHostChannels = 32
}

/// 设计系统颜色
enum AppColors {
    static let primary = Color("AccentColor")
    static let midiActive = Color.green
    static let midiInactive = Color.gray.opacity(0.3)
    static let muteRed = Color.red
    static let soloYellow = Color.yellow
    static let channelBlue = Color.blue
    static let background = Color(UIColor.systemBackground)
    static let secondaryBackground = Color(UIColor.secondarySystemBackground)
    static let cardBackground = Color(UIColor.tertiarySystemBackground)
}

/// 触感反馈管理器
enum HapticManager {
    /// 触发轻量级触感
    static func light() {
        UIImpactFeedbackGenerator(style: .light).impactOccurred()
    }

    /// 触发中量级触感
    static func medium() {
        UIImpactFeedbackGenerator(style: .medium).impactOccurred()
    }

    /// 触发通知触感
    static func notification(_ type: UINotificationFeedbackGenerator.FeedbackType) {
        UINotificationFeedbackGenerator().notificationOccurred(type)
    }
}
