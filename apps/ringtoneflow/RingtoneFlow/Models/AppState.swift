import SwiftUI
import Combine

/// 应用全局状态管理
class AppState: ObservableObject {
    /// 已导出次数
    @Published var exportCount: Int {
        didSet {
            UserDefaults.standard.set(exportCount, forKey: Constants.UserDefaultsKeys.exportCount)
        }
    }

    /// 是否已购买 Pro 版本
    @Published var isPurchased: Bool {
        didSet {
            UserDefaults.standard.set(isPurchased, forKey: Constants.UserDefaultsKeys.isPurchased)
        }
    }

    /// 是否启用深色模式
    @Published var prefersDarkMode: Bool {
        didSet {
            UserDefaults.standard.set(prefersDarkMode, forKey: Constants.UserDefaultsKeys.prefersDarkMode)
        }
    }

    /// 是否已查看过引导页
    @Published var hasSeenOnboarding: Bool {
        didSet {
            UserDefaults.standard.set(hasSeenOnboarding, forKey: Constants.UserDefaultsKeys.hasSeenOnboarding)
        }
    }

    /// 剩余免费导出次数
    var remainingFreeExports: Int {
        max(0, Constants.freeExportLimit - exportCount)
    }

    /// 是否可以导出（已购买或仍有免费额度）
    var canExport: Bool {
        isPurchased || remainingFreeExports > 0
    }

    init() {
        self.exportCount = UserDefaults.standard.integer(forKey: Constants.UserDefaultsKeys.exportCount)
        self.isPurchased = UserDefaults.standard.bool(forKey: Constants.UserDefaultsKeys.isPurchased)
        self.prefersDarkMode = UserDefaults.standard.bool(forKey: Constants.UserDefaultsKeys.prefersDarkMode)
        self.hasSeenOnboarding = UserDefaults.standard.bool(forKey: Constants.UserDefaultsKeys.hasSeenOnboarding)
    }

    /// 记录一次导出
    func recordExport() {
        exportCount += 1
    }

    /// 解锁 Pro 版本
    func unlockPro() {
        isPurchased = true
    }

    /// 重置所有数据（仅用于测试）
    func resetForTesting() {
        exportCount = 0
        isPurchased = false
        prefersDarkMode = false
        hasSeenOnboarding = false
    }
}
