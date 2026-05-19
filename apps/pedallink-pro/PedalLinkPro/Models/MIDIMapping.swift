import Foundation

/// 触发模式：定义脚踏板信号如何触发映射动作
enum TriggerMode: String, Codable, CaseIterable, Identifiable {
    case onPress = "按下触发"
    case onRelease = "释放触发"
    case toggle = "切换模式"
    case momentary = "瞬时模式"

    var id: String { rawValue }
}

/// MIDI 映射规则：将特定 MIDI 输入信号映射到宿主操作
struct MIDIMapping: Codable, Identifiable, Equatable {
    var id = UUID()
    var name: String
    var isEnabled: Bool = true

    // MIDI 输入条件
    var messageType: MIDIMessageType = .controlChange
    var midiChannel: UInt8 = 0
    var controlNumber: UInt8 = 0
    var triggerMode: TriggerMode = .onPress
    var thresholdValue: UInt8 = 64

    // 目标操作
    var action: HostAction

    /// 检查传入的 MIDI 消息是否匹配此映射规则
    /// - Parameter message: 传入的 MIDI 消息
    /// - Returns: 如果消息匹配此映射的输入条件则返回 true
    func matches(_ message: MIDIMessage) -> Bool {
        guard isEnabled else { return false }
        guard message.type == messageType else { return false }
        guard message.channel == midiChannel else { return false }
        guard message.number == controlNumber else { return false }

        switch triggerMode {
        case .onPress, .toggle:
            return message.value >= thresholdValue
        case .onRelease:
            return message.value < thresholdValue
        case .momentary:
            return true
        }
    }

    /// 映射匹配键，用于快速查找
    var matchKey: String {
        "\(messageType.rawValue)_\(midiChannel)_\(controlNumber)"
    }
}
