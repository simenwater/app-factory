import XCTest
@testable import RingtoneFlow

/// TimeInterval 扩展方法测试
final class TimeIntervalExtensionTests: XCTestCase {

    // MARK: - formattedTime Tests

    func testFormattedTimeZero() {
        let time: TimeInterval = 0
        XCTAssertEqual(time.formattedTime, "0:00")
    }

    func testFormattedTimeSeconds() {
        let time: TimeInterval = 5
        XCTAssertEqual(time.formattedTime, "0:05")
    }

    func testFormattedTimeOneMinute() {
        let time: TimeInterval = 60
        XCTAssertEqual(time.formattedTime, "1:00")
    }

    func testFormattedTimeComplex() {
        let time: TimeInterval = 125
        XCTAssertEqual(time.formattedTime, "2:05")
    }

    func testFormattedTimeMaxRingtone() {
        let time: TimeInterval = 40
        XCTAssertEqual(time.formattedTime, "0:40")
    }

    // MARK: - formattedTimePrecise Tests

    func testFormattedTimePreciseZero() {
        let time: TimeInterval = 0
        XCTAssertEqual(time.formattedTimePrecise, "0:00.0")
    }

    func testFormattedTimePreciseWithTenths() {
        let time: TimeInterval = 5.3
        XCTAssertEqual(time.formattedTimePrecise, "0:05.3")
    }

    func testFormattedTimePreciseComplex() {
        let time: TimeInterval = 73.7
        XCTAssertEqual(time.formattedTimePrecise, "1:13.7")
    }
}
