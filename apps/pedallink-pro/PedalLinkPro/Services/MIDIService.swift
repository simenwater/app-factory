import Foundation
import CoreMIDI
import Combine

/// CoreMIDI 服务层，负责 MIDI 设备连接管理和消息接收
///
/// 使用 CoreMIDI API 创建 MIDI 客户端，监听所有连接的 MIDI 输入源，
/// 解析接收到的 MIDI 数据并将其转换为 `MIDIMessage` 模型对象。
class MIDIService: ObservableObject {
    /// 当前连接的 MIDI 源设备列表
    @Published var connectedSources: [MIDISourceInfo] = []
    /// 是否正在运行
    @Published var isRunning: Bool = false
    /// 最近接收的 MIDI 消息（保留最近 100 条）
    @Published var recentMessages: [MIDIMessage] = []
    /// 最后一条消息（用于实时显示）
    @Published var lastMessage: MIDIMessage?
    /// 错误信息
    @Published var errorMessage: String?

    /// MIDI 消息回调，供 MappingEngine 使用
    var onMIDIMessage: ((MIDIMessage) -> Void)?

    private var midiClient: MIDIClientRef = 0
    private var inputPort: MIDIPortRef = 0
    private let maxRecentMessages = 100

    /// MIDI 源设备信息
    struct MIDISourceInfo: Identifiable, Equatable {
        let id: Int
        let name: String
        let endpoint: MIDIEndpointRef
    }

    /// 启动 MIDI 服务：创建客户端、输入端口并连接所有可用源
    func start() {
        let status = MIDIClientCreateWithBlock("PedalLinkPro" as CFString, &midiClient) { [weak self] notification in
            self?.handleMIDINotification(notification)
        }

        guard status == noErr else {
            DispatchQueue.main.async {
                self.errorMessage = "无法创建 MIDI 客户端 (错误码: \(status))"
            }
            return
        }

        let portStatus = MIDIInputPortCreateWithProtocol(
            midiClient,
            "PedalLinkPro Input" as CFString,
            ._1_0,
            &inputPort
        ) { [weak self] eventList, _ in
            self?.handleMIDIEventList(eventList)
        }

        guard portStatus == noErr else {
            DispatchQueue.main.async {
                self.errorMessage = "无法创建 MIDI 输入端口 (错误码: \(portStatus))"
            }
            return
        }

        connectAllSources()

        DispatchQueue.main.async {
            self.isRunning = true
            self.errorMessage = nil
        }
    }

    /// 停止 MIDI 服务，释放所有资源
    func stop() {
        disconnectAllSources()

        if inputPort != 0 {
            MIDIPortDispose(inputPort)
            inputPort = 0
        }
        if midiClient != 0 {
            MIDIClientDispose(midiClient)
            midiClient = 0
        }

        DispatchQueue.main.async {
            self.isRunning = false
            self.connectedSources = []
        }
    }

    /// 刷新设备列表，重新连接所有 MIDI 源
    func refreshDevices() {
        disconnectAllSources()
        connectAllSources()
    }

    /// 清空消息历史记录
    func clearMessages() {
        DispatchQueue.main.async {
            self.recentMessages = []
            self.lastMessage = nil
        }
    }

    // MARK: - Private Methods

    /// 连接所有可用的 MIDI 源
    private func connectAllSources() {
        var sources: [MIDISourceInfo] = []
        let sourceCount = MIDIGetNumberOfSources()

        for i in 0..<sourceCount {
            let endpoint = MIDIGetSource(i)
            let name = getMIDIEndpointName(endpoint)

            MIDIPortConnectSource(inputPort, endpoint, nil)
            sources.append(MIDISourceInfo(id: i, name: name, endpoint: endpoint))
        }

        DispatchQueue.main.async {
            self.connectedSources = sources
        }
    }

    /// 断开所有 MIDI 源
    private func disconnectAllSources() {
        let sourceCount = MIDIGetNumberOfSources()
        for i in 0..<sourceCount {
            let endpoint = MIDIGetSource(i)
            MIDIPortDisconnectSource(inputPort, endpoint)
        }
    }

    /// 处理 MIDI 事件列表（MIDI 1.0 协议）
    /// - Parameter eventList: 指向 MIDIEventList 的不安全指针
    private func handleMIDIEventList(_ eventList: UnsafePointer<MIDIEventList>) {
        let list = eventList.pointee
        var packet = list.packet

        for _ in 0..<list.numPackets {
            let words = Mirror(reflecting: packet.words).children.map { $0.value as! UInt32 }
            if let firstWord = words.first, firstWord != 0 {
                if let message = parseMIDI1Message(firstWord) {
                    dispatchMessage(message)
                }
            }
            packet = MIDIEventPacketNext(&packet).pointee
        }
    }

    /// 解析 MIDI 1.0 UMP (Universal MIDI Packet) 消息
    /// - Parameter word: 32位 MIDI 消息字
    /// - Returns: 解析后的 MIDIMessage，如果不是支持的消息类型则返回 nil
    private func parseMIDI1Message(_ word: UInt32) -> MIDIMessage? {
        let messageType = (word >> 20) & 0xF
        let channel = UInt8((word >> 16) & 0xF)
        let data1 = UInt8((word >> 8) & 0x7F)
        let data2 = UInt8(word & 0x7F)

        let type: MIDIMessageType
        switch messageType {
        case 0xB: type = .controlChange
        case 0x9: type = .noteOn
        case 0x8: type = .noteOff
        case 0xC: type = .programChange
        default: return nil
        }

        return MIDIMessage(
            timestamp: Date(),
            type: type,
            channel: channel,
            number: data1,
            value: data2,
            sourceName: "External"
        )
    }

    /// 分发 MIDI 消息到主线程和回调
    private func dispatchMessage(_ message: MIDIMessage) {
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            self.lastMessage = message
            self.recentMessages.insert(message, at: 0)
            if self.recentMessages.count > self.maxRecentMessages {
                self.recentMessages.removeLast()
            }
        }
        onMIDIMessage?(message)
    }

    /// 处理 MIDI 系统通知（设备连接/断开等）
    private func handleMIDINotification(_ notification: UnsafePointer<MIDINotification>) {
        switch notification.pointee.messageID {
        case .msgSetupChanged:
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) { [weak self] in
                self?.refreshDevices()
            }
        default:
            break
        }
    }

    /// 获取 MIDI 端点的显示名称
    /// - Parameter endpoint: MIDI 端点引用
    /// - Returns: 端点名称字符串
    private func getMIDIEndpointName(_ endpoint: MIDIEndpointRef) -> String {
        var name: Unmanaged<CFString>?
        let status = MIDIObjectGetStringProperty(endpoint, kMIDIPropertyDisplayName, &name)
        if status == noErr, let cfName = name?.takeRetainedValue() {
            return cfName as String
        }
        return "Unknown Device"
    }
}
