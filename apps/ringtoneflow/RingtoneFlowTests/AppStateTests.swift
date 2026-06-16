import XCTest
@testable import RingtoneFlow

/// AppState 状态管理测试
final class AppStateTests: XCTestCase {
    var appState: AppState!

    override func setUp() {
        super.setUp()
        appState = AppState()
        appState.resetForTesting()
    }

    override func tearDown() {
        appState.resetForTesting()
        appState = nil
        super.tearDown()
    }

    // MARK: - Export Count Tests

    func testInitialExportCount() {
        XCTAssertEqual(appState.exportCount, 0)
    }

    func testRecordExport() {
        appState.recordExport()
        XCTAssertEqual(appState.exportCount, 1)

        appState.recordExport()
        XCTAssertEqual(appState.exportCount, 2)
    }

    func testRemainingFreeExports() {
        XCTAssertEqual(appState.remainingFreeExports, Constants.freeExportLimit)

        appState.recordExport()
        XCTAssertEqual(appState.remainingFreeExports, Constants.freeExportLimit - 1)
    }

    func testRemainingFreeExportsNeverNegative() {
        for _ in 0..<10 {
            appState.recordExport()
        }
        XCTAssertEqual(appState.remainingFreeExports, 0, "剩余次数不应为负")
    }

    // MARK: - Can Export Tests

    func testCanExportWithFreeQuota() {
        XCTAssertTrue(appState.canExport, "有免费额度时应可以导出")
    }

    func testCannotExportAfterFreeQuotaExhausted() {
        for _ in 0..<Constants.freeExportLimit {
            appState.recordExport()
        }
        XCTAssertFalse(appState.canExport, "免费额度用完后不应可以导出")
    }

    func testCanExportWithProUnlocked() {
        for _ in 0..<Constants.freeExportLimit {
            appState.recordExport()
        }
        appState.unlockPro()
        XCTAssertTrue(appState.canExport, "Pro 用户始终可以导出")
    }

    // MARK: - Purchase Tests

    func testInitialPurchaseState() {
        XCTAssertFalse(appState.isPurchased)
    }

    func testUnlockPro() {
        appState.unlockPro()
        XCTAssertTrue(appState.isPurchased)
    }

    // MARK: - Dark Mode Tests

    func testInitialDarkModeState() {
        XCTAssertFalse(appState.prefersDarkMode)
    }

    func testToggleDarkMode() {
        appState.prefersDarkMode = true
        XCTAssertTrue(appState.prefersDarkMode)
    }

    // MARK: - Reset Tests

    func testReset() {
        appState.recordExport()
        appState.unlockPro()
        appState.prefersDarkMode = true
        appState.hasSeenOnboarding = true

        appState.resetForTesting()

        XCTAssertEqual(appState.exportCount, 0)
        XCTAssertFalse(appState.isPurchased)
        XCTAssertFalse(appState.prefersDarkMode)
        XCTAssertFalse(appState.hasSeenOnboarding)
    }
}
