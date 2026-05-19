import XCTest
@testable import PedalLinkPro

/// HostAction 和 HostInteropService 单元测试
final class HostInteropServiceTests: XCTestCase {

    // MARK: - HostAction 测试

    /// 测试 HostAction 显示字符串——静音
    func testMuteActionDisplayString() {
        let action = HostAction(hostApp: .aum, actionType: .mute, targetChannel: 0)
        XCTAssertEqual(action.displayString, "AUM - 通道 1 静音切换")
    }

    /// 测试 HostAction 显示字符串——独奏
    func testSoloActionDisplayString() {
        let action = HostAction(hostApp: .aum, actionType: .solo, targetChannel: 2)
        XCTAssertEqual(action.displayString, "AUM - 通道 3 独奏切换")
    }

    /// 测试 HostAction 显示字符串——选择通道
    func testSelectChannelDisplayString() {
        let action = HostAction(hostApp: .audiobus, actionType: .selectChannel, targetChannel: 4)
        XCTAssertEqual(action.displayString, "Audiobus - 选择通道 5")
    }

    /// 测试 HostAction 显示字符串——音量
    func testVolumeActionDisplayString() {
        let action = HostAction(hostApp: .generic, actionType: .volume, targetChannel: 0, parameterValue: 100)
        XCTAssertEqual(action.displayString, "通用 MIDI - 通道 1 音量 100")
    }

    // MARK: - HostApp 测试

    /// 测试 AUM URL Scheme
    func testAUMURLScheme() {
        XCTAssertEqual(HostApp.aum.urlScheme, "aum")
    }

    /// 测试 Audiobus URL Scheme
    func testAudiobusURLScheme() {
        XCTAssertEqual(HostApp.audiobus.urlScheme, "audiobus")
    }

    /// 测试通用 MIDI 无 URL Scheme
    func testGenericNoURLScheme() {
        XCTAssertNil(HostApp.generic.urlScheme)
    }

    // MARK: - ChannelActionType 测试

    /// 测试所有操作类型都有图标
    func testAllActionTypesHaveIcons() {
        for actionType in ChannelActionType.allCases {
            XCTAssertFalse(actionType.iconName.isEmpty, "\(actionType.rawValue) 应有图标")
        }
    }

    /// 测试操作类型枚举值
    func testActionTypeCaseCount() {
        XCTAssertEqual(ChannelActionType.allCases.count, 6)
    }

    // MARK: - MIDIMapping 匹配测试

    /// 测试映射的 matches 方法
    func testMappingMatches() {
        let mapping = MIDIMapping(
            name: "Test",
            messageType: .controlChange,
            midiChannel: 0,
            controlNumber: 64,
            triggerMode: .onPress,
            thresholdValue: 64,
            action: HostAction(hostApp: .aum, actionType: .mute, targetChannel: 0)
        )

        let matchMsg = MIDIMessage(
            timestamp: Date(), type: .controlChange, channel: 0, number: 64, value: 127, sourceName: "Test"
        )
        let wrongCC = MIDIMessage(
            timestamp: Date(), type: .controlChange, channel: 0, number: 65, value: 127, sourceName: "Test"
        )
        let wrongChannel = MIDIMessage(
            timestamp: Date(), type: .controlChange, channel: 1, number: 64, value: 127, sourceName: "Test"
        )
        let wrongType = MIDIMessage(
            timestamp: Date(), type: .noteOn, channel: 0, number: 64, value: 127, sourceName: "Test"
        )
        let belowThreshold = MIDIMessage(
            timestamp: Date(), type: .controlChange, channel: 0, number: 64, value: 10, sourceName: "Test"
        )

        XCTAssertTrue(mapping.matches(matchMsg))
        XCTAssertFalse(mapping.matches(wrongCC))
        XCTAssertFalse(mapping.matches(wrongChannel))
        XCTAssertFalse(mapping.matches(wrongType))
        XCTAssertFalse(mapping.matches(belowThreshold))
    }

    /// 测试 toggle 触发模式
    func testToggleTriggerMode() {
        let mapping = MIDIMapping(
            name: "Toggle Test",
            messageType: .controlChange,
            midiChannel: 0,
            controlNumber: 64,
            triggerMode: .toggle,
            thresholdValue: 64,
            action: HostAction(hostApp: .aum, actionType: .mute, targetChannel: 0)
        )

        let pressed = MIDIMessage(
            timestamp: Date(), type: .controlChange, channel: 0, number: 64, value: 127, sourceName: "Test"
        )
        let released = MIDIMessage(
            timestamp: Date(), type: .controlChange, channel: 0, number: 64, value: 0, sourceName: "Test"
        )

        XCTAssertTrue(mapping.matches(pressed), "Toggle 模式应在按下时匹配")
        XCTAssertFalse(mapping.matches(released), "Toggle 模式不应在释放时匹配")
    }

    /// 测试 HostAction 的 Equatable 一致性
    func testHostActionEquatable() {
        let action1 = HostAction(id: UUID(), hostApp: .aum, actionType: .mute, targetChannel: 0)
        var action2 = action1
        action2.targetChannel = 1

        XCTAssertNotEqual(action1, action2)
    }

    /// 测试 MIDIMapping 的 Codable 一致性
    func testMappingCodable() throws {
        let mapping = MIDIMapping(
            name: "Codable Test",
            messageType: .controlChange,
            midiChannel: 5,
            controlNumber: 11,
            triggerMode: .momentary,
            thresholdValue: 0,
            action: HostAction(hostApp: .aum, actionType: .volume, targetChannel: 2, parameterValue: 100)
        )

        let encoded = try JSONEncoder().encode(mapping)
        let decoded = try JSONDecoder().decode(MIDIMapping.self, from: encoded)

        XCTAssertEqual(decoded.name, mapping.name)
        XCTAssertEqual(decoded.messageType, mapping.messageType)
        XCTAssertEqual(decoded.midiChannel, mapping.midiChannel)
        XCTAssertEqual(decoded.controlNumber, mapping.controlNumber)
        XCTAssertEqual(decoded.triggerMode, mapping.triggerMode)
        XCTAssertEqual(decoded.action.hostApp, mapping.action.hostApp)
        XCTAssertEqual(decoded.action.actionType, mapping.action.actionType)
        XCTAssertEqual(decoded.action.targetChannel, mapping.action.targetChannel)
        XCTAssertEqual(decoded.action.parameterValue, mapping.action.parameterValue)
    }
}
