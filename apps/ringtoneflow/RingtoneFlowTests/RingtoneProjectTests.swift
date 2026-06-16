import XCTest
@testable import RingtoneFlow

/// RingtoneProject 数据模型测试
final class RingtoneProjectTests: XCTestCase {

    // MARK: - Initialization Tests

    func testDefaultInitialization() {
        let url = URL(fileURLWithPath: "/tmp/test.mp3")
        let project = RingtoneProject(sourceURL: url, totalDuration: 120)

        XCTAssertEqual(project.sourceURL, url)
        XCTAssertEqual(project.totalDuration, 120)
        XCTAssertEqual(project.startTime, 0)
        XCTAssertEqual(project.endTime, 40, "默认结束时间应被限制为 maxRingtoneDuration")
        XCTAssertEqual(project.fadeInDuration, 0)
        XCTAssertEqual(project.fadeOutDuration, 0)
        XCTAssertEqual(project.name, "test")
    }

    func testCustomName() {
        let url = URL(fileURLWithPath: "/tmp/song.mp3")
        let project = RingtoneProject(name: "MyRingtone", sourceURL: url, totalDuration: 60)

        XCTAssertEqual(project.name, "MyRingtone")
    }

    func testShortAudioEndTime() {
        let url = URL(fileURLWithPath: "/tmp/short.mp3")
        let project = RingtoneProject(sourceURL: url, totalDuration: 15)

        XCTAssertEqual(project.endTime, 15, "短音频的结束时间应等于总时长")
    }

    // MARK: - Duration Tests

    func testTrimmedDuration() {
        let url = URL(fileURLWithPath: "/tmp/test.mp3")
        let project = RingtoneProject(
            sourceURL: url,
            totalDuration: 120,
            startTime: 10,
            endTime: 30
        )

        XCTAssertEqual(project.trimmedDuration, 20)
    }

    func testIsWithinLimitValid() {
        let url = URL(fileURLWithPath: "/tmp/test.mp3")
        let project = RingtoneProject(
            sourceURL: url,
            totalDuration: 120,
            startTime: 0,
            endTime: 30
        )

        XCTAssertTrue(project.isWithinLimit)
    }

    func testIsWithinLimitTooShort() {
        let url = URL(fileURLWithPath: "/tmp/test.mp3")
        let project = RingtoneProject(
            sourceURL: url,
            totalDuration: 120,
            startTime: 10,
            endTime: 10.5
        )

        XCTAssertFalse(project.isWithinLimit, "时长低于最低限制应返回 false")
    }

    func testEndTimeClampedToMaxDuration() {
        let url = URL(fileURLWithPath: "/tmp/test.mp3")
        let project = RingtoneProject(
            sourceURL: url,
            totalDuration: 300,
            startTime: 0,
            endTime: 300
        )

        XCTAssertEqual(project.endTime, Constants.maxRingtoneDuration,
                       "结束时间应被限制为起始 + maxRingtoneDuration")
    }

    // MARK: - File Name Tests

    func testSourceFileName() {
        let url = URL(fileURLWithPath: "/tmp/My Song.mp3")
        let project = RingtoneProject(sourceURL: url, totalDuration: 60)

        XCTAssertEqual(project.sourceFileName, "My Song")
    }

    func testExportFileName() {
        let url = URL(fileURLWithPath: "/tmp/test.mp3")
        let project = RingtoneProject(name: "Ringtone1", sourceURL: url, totalDuration: 60)

        XCTAssertEqual(project.exportFileName, "Ringtone1.m4r")
    }
}
