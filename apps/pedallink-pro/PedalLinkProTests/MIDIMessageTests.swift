import XCTest
@testable import PedalLinkPro

/// MIDIMessage 模型单元测试
final class MIDIMessageTests: XCTestCase {

    // MARK: - 消息创建测试

    /// 测试 CC 消息的正确创建
    func testControlChangeMessageCreation() {
        let message = MIDIMessage(
            timestamp: Date(),
            type: .controlChange,
            channel: 0,
            number: 64,
            value: 127,
            sourceName: "Test Device"
        )

        XCTAssertEqual(message.type, .controlChange)
        XCTAssertEqual(message.channel, 0)
        XCTAssertEqual(message.number, 64)
        XCTAssertEqual(message.value, 127)
        XCTAssertEqual(message.sourceName, "Test Device")
    }

    /// 测试 Note On 消息的正确创建
    func testNoteOnMessageCreation() {
        let message = MIDIMessage(
            timestamp: Date(),
            type: .noteOn,
            channel: 5,
            number: 60,
            value: 100,
            sourceName: "Pedal"
        )

        XCTAssertEqual(message.type, .noteOn)
        XCTAssertEqual(message.channel, 5)
        XCTAssertEqual(message.number, 60)
        XCTAssertEqual(message.value, 100)
    }

    // MARK: - 显示字符串测试

    /// 测试 CC 消息的显示格式
    func testControlChangeDisplayString() {
        let message = MIDIMessage(
            timestamp: Date(),
            type: .controlChange,
            channel: 0,
            number: 64,
            value: 127,
            sourceName: "Test"
        )

        XCTAssertEqual(message.displayString, "CC 64 = 127 [Ch 1]")
    }

    /// 测试 Note On 消息的显示格式
    func testNoteOnDisplayString() {
        let message = MIDIMessage(
            timestamp: Date(),
            type: .noteOn,
            channel: 9,
            number: 36,
            value: 80,
            sourceName: "Test"
        )

        XCTAssertEqual(message.displayString, "Note On 36 vel=80 [Ch 10]")
    }

    /// 测试 Program Change 消息的显示格式
    func testProgramChangeDisplayString() {
        let message = MIDIMessage(
            timestamp: Date(),
            type: .programChange,
            channel: 2,
            number: 5,
            value: 0,
            sourceName: "Test"
        )

        XCTAssertEqual(message.displayString, "PC 5 [Ch 3]")
    }

    // MARK: - 匹配键测试

    /// 测试匹配键的唯一性
    func testMatchKeyUniqueness() {
        let msg1 = MIDIMessage(
            timestamp: Date(), type: .controlChange, channel: 0, number: 64, value: 127, sourceName: "Test"
        )
        let msg2 = MIDIMessage(
            timestamp: Date(), type: .controlChange, channel: 0, number: 64, value: 0, sourceName: "Test"
        )
        let msg3 = MIDIMessage(
            timestamp: Date(), type: .controlChange, channel: 1, number: 64, value: 127, sourceName: "Test"
        )

        XCTAssertEqual(msg1.matchKey, msg2.matchKey, "相同类型/通道/编号应有相同 matchKey")
        XCTAssertNotEqual(msg1.matchKey, msg3.matchKey, "不同通道应有不同 matchKey")
    }

    /// 测试不同消息类型的匹配键不同
    func testMatchKeyDifferentTypes() {
        let ccMsg = MIDIMessage(
            timestamp: Date(), type: .controlChange, channel: 0, number: 64, value: 127, sourceName: "Test"
        )
        let noteMsg = MIDIMessage(
            timestamp: Date(), type: .noteOn, channel: 0, number: 64, value: 127, sourceName: "Test"
        )

        XCTAssertNotEqual(ccMsg.matchKey, noteMsg.matchKey)
    }
}
