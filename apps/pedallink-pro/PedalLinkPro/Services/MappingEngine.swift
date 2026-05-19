import Foundation
import Combine

/// 映射引擎：核心业务逻辑层
///
/// 负责管理所有 MIDI 映射规则，处理传入的 MIDI 消息，
/// 并根据匹配的映射规则触发相应的宿主操作。
/// 使用字典索引实现 O(1) 映射查找性能。
class MappingEngine: ObservableObject {
    /// 所有映射规则列表
    @Published var mappings: [MIDIMapping] = []
    /// 最近触发的映射（用于 UI 高亮）
    @Published var lastTriggeredMappingId: UUID?
    /// 各通道的切换状态（mute/solo 等 toggle 状态）
    @Published var toggleStates: [String: Bool] = [:]

    private let storageKey = "PedalLinkPro_Mappings"
    private var mappingIndex: [String: [MIDIMapping]] = [:]
    private let hostInterop = HostInteropService()

    /// 处理传入的 MIDI 消息，查找匹配的映射并执行操作
    /// - Parameter message: 接收到的 MIDI 消息
    func process(message: MIDIMessage) {
        let matchingMappings = findMatchingMappings(for: message)

        for mapping in matchingMappings {
            executeMapping(mapping, with: message)
        }
    }

    /// 根据 MIDI 消息查找所有匹配的映射规则
    /// - Parameter message: MIDI 消息
    /// - Returns: 匹配的映射规则数组
    func findMatchingMappings(for message: MIDIMessage) -> [MIDIMapping] {
        guard let candidates = mappingIndex[message.matchKey] else { return [] }
        return candidates.filter { $0.matches(message) }
    }

    /// 执行映射操作
    /// - Parameters:
    ///   - mapping: 匹配的映射规则
    ///   - message: 触发映射的 MIDI 消息
    private func executeMapping(_ mapping: MIDIMapping, with message: MIDIMessage) {
        var action = mapping.action

        if mapping.triggerMode == .toggle {
            let stateKey = "\(mapping.id)_toggle"
            let currentState = toggleStates[stateKey] ?? false
            let newState = !currentState

            DispatchQueue.main.async {
                self.toggleStates[stateKey] = newState
            }

            if action.actionType == .volume || action.actionType == .pan || action.actionType == .send {
                action.parameterValue = newState ? 127 : 0
            }
        }

        if mapping.action.actionType == .volume ||
           mapping.action.actionType == .pan ||
           mapping.action.actionType == .send {
            if mapping.triggerMode == .momentary {
                action.parameterValue = Int(message.value)
            }
        }

        hostInterop.execute(action: action)

        DispatchQueue.main.async {
            self.lastTriggeredMappingId = mapping.id
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                if self.lastTriggeredMappingId == mapping.id {
                    self.lastTriggeredMappingId = nil
                }
            }
        }
    }

    // MARK: - CRUD 操作

    /// 添加新的映射规则
    /// - Parameter mapping: 要添加的映射规则
    func addMapping(_ mapping: MIDIMapping) {
        mappings.append(mapping)
        rebuildIndex()
        saveMappings()
    }

    /// 更新已有的映射规则
    /// - Parameter mapping: 更新后的映射规则
    func updateMapping(_ mapping: MIDIMapping) {
        if let index = mappings.firstIndex(where: { $0.id == mapping.id }) {
            mappings[index] = mapping
            rebuildIndex()
            saveMappings()
        }
    }

    /// 删除映射规则
    /// - Parameter mapping: 要删除的映射规则
    func deleteMapping(_ mapping: MIDIMapping) {
        mappings.removeAll { $0.id == mapping.id }
        rebuildIndex()
        saveMappings()
    }

    /// 批量删除映射规则
    /// - Parameter offsets: 要删除的索引集合
    func deleteMappings(at offsets: IndexSet) {
        mappings.remove(atOffsets: offsets)
        rebuildIndex()
        saveMappings()
    }

    /// 移动映射规则顺序
    /// - Parameters:
    ///   - source: 源索引集合
    ///   - destination: 目标索引
    func moveMappings(from source: IndexSet, to destination: Int) {
        mappings.move(fromOffsets: source, toOffset: destination)
        saveMappings()
    }

    // MARK: - 预设

    /// 创建默认预设映射（适用于常见脚踏板配置）
    /// - Parameter hostApp: 目标宿主应用
    /// - Returns: 预设映射规则数组
    static func createDefaultPreset(for hostApp: HostApp) -> [MIDIMapping] {
        return [
            MIDIMapping(
                name: "脚踏 1 → 通道 1 静音",
                messageType: .controlChange,
                midiChannel: 0,
                controlNumber: 64,
                triggerMode: .toggle,
                action: HostAction(hostApp: hostApp, actionType: .mute, targetChannel: 0)
            ),
            MIDIMapping(
                name: "脚踏 2 → 通道 2 静音",
                messageType: .controlChange,
                midiChannel: 0,
                controlNumber: 65,
                triggerMode: .toggle,
                action: HostAction(hostApp: hostApp, actionType: .mute, targetChannel: 1)
            ),
            MIDIMapping(
                name: "脚踏 3 → 通道 1 独奏",
                messageType: .controlChange,
                midiChannel: 0,
                controlNumber: 66,
                triggerMode: .toggle,
                action: HostAction(hostApp: hostApp, actionType: .solo, targetChannel: 0)
            ),
            MIDIMapping(
                name: "表情踏板 → 通道 1 音量",
                messageType: .controlChange,
                midiChannel: 0,
                controlNumber: 11,
                triggerMode: .momentary,
                action: HostAction(hostApp: hostApp, actionType: .volume, targetChannel: 0, parameterValue: 0)
            ),
        ]
    }

    /// 加载默认预设
    /// - Parameter hostApp: 目标宿主应用
    func loadPreset(for hostApp: HostApp) {
        let preset = Self.createDefaultPreset(for: hostApp)
        mappings.append(contentsOf: preset)
        rebuildIndex()
        saveMappings()
    }

    // MARK: - 持久化

    /// 从 UserDefaults 加载映射规则
    func loadMappings() {
        guard let data = UserDefaults.standard.data(forKey: storageKey),
              let decoded = try? JSONDecoder().decode([MIDIMapping].self, from: data) else {
            return
        }
        mappings = decoded
        rebuildIndex()
    }

    /// 保存映射规则到 UserDefaults
    func saveMappings() {
        if let encoded = try? JSONEncoder().encode(mappings) {
            UserDefaults.standard.set(encoded, forKey: storageKey)
        }
    }

    /// 重建映射索引以优化查找性能
    private func rebuildIndex() {
        mappingIndex = [:]
        for mapping in mappings where mapping.isEnabled {
            let key = mapping.matchKey
            mappingIndex[key, default: []].append(mapping)
        }
    }
}
