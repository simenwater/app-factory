import Foundation
import Combine

/// MIDI 监视器视图模型
///
/// 管理 MIDI 监视器视图的状态和过滤逻辑，
/// 提供实时消息流的过滤和搜索功能。
class MIDIMonitorViewModel: ObservableObject {
    /// 消息类型过滤器
    @Published var filterType: MIDIMessageType? = nil
    /// 通道过滤器 (-1 表示全部)
    @Published var filterChannel: Int = -1
    /// 是否暂停更新
    @Published var isPaused: Bool = false
    /// 是否显示 MIDI 学习模式
    @Published var isLearning: Bool = false
    /// MIDI 学习回调
    var onLearnedMessage: ((MIDIMessage) -> Void)?

    /// 过滤消息列表
    /// - Parameter messages: 原始消息列表
    /// - Returns: 过滤后的消息列表
    func filteredMessages(_ messages: [MIDIMessage]) -> [MIDIMessage] {
        messages.filter { message in
            if let type = filterType, message.type != type {
                return false
            }
            if filterChannel >= 0 && message.channel != UInt8(filterChannel) {
                return false
            }
            return true
        }
    }

    /// 处理 MIDI 学习模式下收到的消息
    /// - Parameter message: 学习到的 MIDI 消息
    func handleLearnedMessage(_ message: MIDIMessage) {
        isLearning = false
        onLearnedMessage?(message)
    }
}
