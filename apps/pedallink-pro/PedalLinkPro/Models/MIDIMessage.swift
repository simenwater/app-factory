import Foundation

/// MIDI 消息类型枚举
enum MIDIMessageType: String, Codable, CaseIterable {
    case controlChange = "CC"
    case noteOn = "Note On"
    case noteOff = "Note Off"
    case programChange = "PC"
}

/// MIDI 消息模型，表示从外部设备接收的单条 MIDI 数据
struct MIDIMessage: Identifiable, Equatable {
    let id = UUID()
    let timestamp: Date
    let type: MIDIMessageType
    let channel: UInt8
    let number: UInt8
    let value: UInt8
    let sourceName: String

    /// 格式化消息用于 UI 显示
    var displayString: String {
        switch type {
        case .controlChange:
            return "CC \(number) = \(value) [Ch \(channel + 1)]"
        case .noteOn:
            return "Note On \(number) vel=\(value) [Ch \(channel + 1)]"
        case .noteOff:
            return "Note Off \(number) [Ch \(channel + 1)]"
        case .programChange:
            return "PC \(number) [Ch \(channel + 1)]"
        }
    }

    /// 用于匹配映射规则的唯一键
    var matchKey: String {
        "\(type.rawValue)_\(channel)_\(number)"
    }
}
