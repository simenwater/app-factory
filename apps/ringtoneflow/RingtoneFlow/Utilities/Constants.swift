import Foundation

/// 全局常量定义
enum Constants {
    /// 铃声最大时长（秒）—— iOS 铃声限制 40 秒
    static let maxRingtoneDuration: TimeInterval = 40.0

    /// 铃声最小时长（秒）
    static let minRingtoneDuration: TimeInterval = 1.0

    /// 默认 Fade 时长（秒）
    static let defaultFadeDuration: TimeInterval = 1.0

    /// 最大 Fade 时长（秒）
    static let maxFadeDuration: TimeInterval = 5.0

    /// 免费导出次数
    static let freeExportLimit: Int = 3

    /// StoreKit 产品 ID
    static let proUnlockProductID = "com.ringtoneflow.pro.unlock"

    /// 导出音频格式
    static let exportFileExtension = "m4r"

    /// 波形采样点数
    static let waveformSampleCount: Int = 200

    /// 支持的音频文件类型（UTType identifiers）
    static let supportedAudioTypes = [
        "public.audio",
        "public.mp3",
        "com.apple.m4a-audio",
        "public.aiff-audio",
        "com.microsoft.waveform-audio"
    ]

    /// 应用名称
    static let appName = "RingtoneFlow"

    /// UserDefaults 键
    enum UserDefaultsKeys {
        static let exportCount = "ringtoneflow_export_count"
        static let isPurchased = "ringtoneflow_is_purchased"
        static let prefersDarkMode = "ringtoneflow_dark_mode"
        static let hasSeenOnboarding = "ringtoneflow_onboarding"
    }
}
