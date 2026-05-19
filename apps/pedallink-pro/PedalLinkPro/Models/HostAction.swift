import Foundation

/// 宿主软件通道操作类型
enum ChannelActionType: String, Codable, CaseIterable, Identifiable {
    case mute = "静音"
    case solo = "独奏"
    case selectChannel = "选择通道"
    case volume = "音量"
    case pan = "声相"
    case send = "发送"

    var id: String { rawValue }

    /// 操作图标名称（SF Symbols）
    var iconName: String {
        switch self {
        case .mute: return "speaker.slash.fill"
        case .solo: return "headphones"
        case .selectChannel: return "arrow.right.circle.fill"
        case .volume: return "speaker.wave.2.fill"
        case .pan: return "slider.horizontal.below.rectangle"
        case .send: return "arrow.up.right"
        }
    }
}

/// 目标宿主应用枚举
enum HostApp: String, Codable, CaseIterable, Identifiable {
    case aum = "AUM"
    case audiobus = "Audiobus"
    case garageBand = "GarageBand"
    case cubasis = "Cubasis"
    case generic = "通用 MIDI"

    var id: String { rawValue }

    /// 宿主应用的 URL Scheme
    var urlScheme: String? {
        switch self {
        case .aum: return "aum"
        case .audiobus: return "audiobus"
        case .garageBand: return "garageband"
        case .cubasis: return "cubasis"
        case .generic: return nil
        }
    }
}

/// 宿主操作指令，描述要对目标宿主应用执行的具体操作
struct HostAction: Codable, Equatable, Identifiable {
    var id = UUID()
    var hostApp: HostApp
    var actionType: ChannelActionType
    var targetChannel: Int
    var parameterValue: Int?

    /// 生成操作描述字符串
    var displayString: String {
        let channelStr = "通道 \(targetChannel + 1)"
        switch actionType {
        case .mute:
            return "\(hostApp.rawValue) - \(channelStr) 静音切换"
        case .solo:
            return "\(hostApp.rawValue) - \(channelStr) 独奏切换"
        case .selectChannel:
            return "\(hostApp.rawValue) - 选择\(channelStr)"
        case .volume:
            return "\(hostApp.rawValue) - \(channelStr) 音量 \(parameterValue ?? 0)"
        case .pan:
            return "\(hostApp.rawValue) - \(channelStr) 声相 \(parameterValue ?? 64)"
        case .send:
            return "\(hostApp.rawValue) - \(channelStr) 发送 \(parameterValue ?? 0)"
        }
    }
}
