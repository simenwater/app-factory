import XCTest
@testable import RingtoneFlow

/// Constants 配置测试
final class ConstantsTests: XCTestCase {

    func testMaxRingtoneDuration() {
        XCTAssertEqual(Constants.maxRingtoneDuration, 40.0,
                       "iOS 铃声最大时长应为 40 秒")
    }

    func testMinRingtoneDuration() {
        XCTAssertGreaterThan(Constants.minRingtoneDuration, 0,
                            "最小时长应大于 0")
    }

    func testFreeExportLimit() {
        XCTAssertEqual(Constants.freeExportLimit, 3,
                       "免费导出次数应为 3")
    }

    func testExportFileExtension() {
        XCTAssertEqual(Constants.exportFileExtension, "m4r",
                       "导出文件扩展名应为 m4r")
    }

    func testWaveformSampleCount() {
        XCTAssertGreaterThan(Constants.waveformSampleCount, 0)
        XCTAssertLessThanOrEqual(Constants.waveformSampleCount, 500,
                                 "采样点数不应过大以免影响性能")
    }

    func testSupportedAudioTypes() {
        XCTAssertFalse(Constants.supportedAudioTypes.isEmpty,
                       "应支持至少一种音频格式")
        XCTAssertTrue(Constants.supportedAudioTypes.contains("public.mp3"),
                      "应支持 MP3 格式")
    }

    func testProductID() {
        XCTAssertFalse(Constants.proUnlockProductID.isEmpty,
                       "产品 ID 不应为空")
    }
}
