import XCTest
@testable import PedalLinkPro

/// MappingEngine 核心逻辑单元测试
final class MappingEngineTests: XCTestCase {
    var engine: MappingEngine!

    override func setUp() {
        super.setUp()
        engine = MappingEngine()
    }

    override func tearDown() {
        engine = nil
        super.tearDown()
    }

    // MARK: - CRUD 操作测试

    /// 测试添加映射
    func testAddMapping() {
        let mapping = createTestMapping(name: "Test Mapping", cc: 64)
        engine.addMapping(mapping)

        XCTAssertEqual(engine.mappings.count, 1)
        XCTAssertEqual(engine.mappings.first?.name, "Test Mapping")
    }

    /// 测试更新映射
    func testUpdateMapping() {
        var mapping = createTestMapping(name: "Original", cc: 64)
        engine.addMapping(mapping)

        mapping.name = "Updated"
        engine.updateMapping(mapping)

        XCTAssertEqual(engine.mappings.count, 1)
        XCTAssertEqual(engine.mappings.first?.name, "Updated")
    }

    /// 测试删除映射
    func testDeleteMapping() {
        let mapping1 = createTestMapping(name: "Mapping 1", cc: 64)
        let mapping2 = createTestMapping(name: "Mapping 2", cc: 65)
        engine.addMapping(mapping1)
        engine.addMapping(mapping2)

        engine.deleteMapping(mapping1)

        XCTAssertEqual(engine.mappings.count, 1)
        XCTAssertEqual(engine.mappings.first?.name, "Mapping 2")
    }

    /// 测试批量删除
    func testDeleteMappingsAtOffsets() {
        for i in 0..<5 {
            engine.addMapping(createTestMapping(name: "Mapping \(i)", cc: UInt8(60 + i)))
        }

        engine.deleteMappings(at: IndexSet([0, 2, 4]))

        XCTAssertEqual(engine.mappings.count, 2)
        XCTAssertEqual(engine.mappings[0].name, "Mapping 1")
        XCTAssertEqual(engine.mappings[1].name, "Mapping 3")
    }

    // MARK: - 映射匹配测试

    /// 测试 CC 消息匹配
    func testCCMessageMatching() {
        let mapping = createTestMapping(name: "CC64 Mute", cc: 64)
        engine.addMapping(mapping)

        let matchingMsg = MIDIMessage(
            timestamp: Date(), type: .controlChange, channel: 0, number: 64, value: 127, sourceName: "Test"
        )
        let nonMatchingMsg = MIDIMessage(
            timestamp: Date(), type: .controlChange, channel: 0, number: 65, value: 127, sourceName: "Test"
        )

        let matches = engine.findMatchingMappings(for: matchingMsg)
        let nonMatches = engine.findMatchingMappings(for: nonMatchingMsg)

        XCTAssertEqual(matches.count, 1)
        XCTAssertEqual(nonMatches.count, 0)
    }

    /// 测试禁用的映射不匹配
    func testDisabledMappingNotMatched() {
        var mapping = createTestMapping(name: "Disabled", cc: 64)
        mapping.isEnabled = false
        engine.addMapping(mapping)

        let message = MIDIMessage(
            timestamp: Date(), type: .controlChange, channel: 0, number: 64, value: 127, sourceName: "Test"
        )

        let matches = engine.findMatchingMappings(for: message)
        XCTAssertEqual(matches.count, 0)
    }

    /// 测试触发阈值——onPress 模式
    func testOnPressTriggerThreshold() {
        var mapping = createTestMapping(name: "OnPress", cc: 64)
        mapping.triggerMode = .onPress
        mapping.thresholdValue = 64
        engine.addMapping(mapping)

        let belowThreshold = MIDIMessage(
            timestamp: Date(), type: .controlChange, channel: 0, number: 64, value: 63, sourceName: "Test"
        )
        let atThreshold = MIDIMessage(
            timestamp: Date(), type: .controlChange, channel: 0, number: 64, value: 64, sourceName: "Test"
        )
        let aboveThreshold = MIDIMessage(
            timestamp: Date(), type: .controlChange, channel: 0, number: 64, value: 127, sourceName: "Test"
        )

        XCTAssertEqual(engine.findMatchingMappings(for: belowThreshold).count, 0)
        XCTAssertEqual(engine.findMatchingMappings(for: atThreshold).count, 1)
        XCTAssertEqual(engine.findMatchingMappings(for: aboveThreshold).count, 1)
    }

    /// 测试 onRelease 触发模式
    func testOnReleaseTriggerMode() {
        var mapping = createTestMapping(name: "OnRelease", cc: 64)
        mapping.triggerMode = .onRelease
        mapping.thresholdValue = 64
        engine.addMapping(mapping)

        let released = MIDIMessage(
            timestamp: Date(), type: .controlChange, channel: 0, number: 64, value: 0, sourceName: "Test"
        )
        let pressed = MIDIMessage(
            timestamp: Date(), type: .controlChange, channel: 0, number: 64, value: 127, sourceName: "Test"
        )

        XCTAssertEqual(engine.findMatchingMappings(for: released).count, 1)
        XCTAssertEqual(engine.findMatchingMappings(for: pressed).count, 0)
    }

    /// 测试 momentary 模式始终匹配
    func testMomentaryTriggerAlwaysMatches() {
        var mapping = createTestMapping(name: "Momentary", cc: 11)
        mapping.triggerMode = .momentary
        engine.addMapping(mapping)

        for value: UInt8 in [0, 32, 64, 96, 127] {
            let msg = MIDIMessage(
                timestamp: Date(), type: .controlChange, channel: 0, number: 11, value: value, sourceName: "Test"
            )
            XCTAssertEqual(engine.findMatchingMappings(for: msg).count, 1, "值 \(value) 应匹配 momentary 映射")
        }
    }

    /// 测试多个映射可以绑定同一 CC
    func testMultipleMappingsForSameCC() {
        let mapping1 = createTestMapping(name: "Mute Ch1", cc: 64, actionType: .mute, channel: 0)
        let mapping2 = createTestMapping(name: "Solo Ch2", cc: 64, actionType: .solo, channel: 1)
        engine.addMapping(mapping1)
        engine.addMapping(mapping2)

        let msg = MIDIMessage(
            timestamp: Date(), type: .controlChange, channel: 0, number: 64, value: 127, sourceName: "Test"
        )

        let matches = engine.findMatchingMappings(for: msg)
        XCTAssertEqual(matches.count, 2)
    }

    /// 测试不同 MIDI 通道的映射互不干扰
    func testChannelIsolation() {
        let mapping = createTestMapping(name: "Ch0 Only", cc: 64)
        engine.addMapping(mapping)

        let ch0Msg = MIDIMessage(
            timestamp: Date(), type: .controlChange, channel: 0, number: 64, value: 127, sourceName: "Test"
        )
        let ch1Msg = MIDIMessage(
            timestamp: Date(), type: .controlChange, channel: 1, number: 64, value: 127, sourceName: "Test"
        )

        XCTAssertEqual(engine.findMatchingMappings(for: ch0Msg).count, 1)
        XCTAssertEqual(engine.findMatchingMappings(for: ch1Msg).count, 0)
    }

    // MARK: - 预设测试

    /// 测试默认预设创建
    func testDefaultPresetCreation() {
        let preset = MappingEngine.createDefaultPreset(for: .aum)

        XCTAssertEqual(preset.count, 4, "AUM 默认预设应包含 4 个映射")
        XCTAssertTrue(preset.allSatisfy { $0.action.hostApp == .aum })
        XCTAssertTrue(preset.allSatisfy { $0.isEnabled })
    }

    /// 测试加载预设
    func testLoadPreset() {
        engine.loadPreset(for: .aum)

        XCTAssertEqual(engine.mappings.count, 4)
        XCTAssertTrue(engine.mappings.allSatisfy { $0.action.hostApp == .aum })
    }

    // MARK: - 辅助方法

    /// 创建测试用映射规则
    private func createTestMapping(
        name: String,
        cc: UInt8,
        actionType: ChannelActionType = .mute,
        channel: Int = 0
    ) -> MIDIMapping {
        MIDIMapping(
            name: name,
            messageType: .controlChange,
            midiChannel: 0,
            controlNumber: cc,
            triggerMode: .onPress,
            thresholdValue: 64,
            action: HostAction(
                hostApp: .aum,
                actionType: actionType,
                targetChannel: channel
            )
        )
    }
}
