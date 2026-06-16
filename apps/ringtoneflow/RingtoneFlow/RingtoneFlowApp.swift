import SwiftUI

/// RingtoneFlow 应用入口
@main
struct RingtoneFlowApp: App {
    @StateObject private var storeVM = StoreViewModel()
    @StateObject private var appState = AppState()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(storeVM)
                .environmentObject(appState)
                .preferredColorScheme(appState.prefersDarkMode ? .dark : nil)
        }
    }
}
