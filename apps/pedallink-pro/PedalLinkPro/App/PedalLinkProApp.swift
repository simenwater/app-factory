import SwiftUI

/// PedalLink Pro 应用程序入口
@main
struct PedalLinkProApp: App {
    @StateObject private var midiService = MIDIService()
    @StateObject private var mappingEngine = MappingEngine()
    @StateObject private var storeService = StoreKitService()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(midiService)
                .environmentObject(mappingEngine)
                .environmentObject(storeService)
                .preferredColorScheme(.dark)
                .onAppear {
                    midiService.start()
                    mappingEngine.loadMappings()
                    midiService.onMIDIMessage = { [weak mappingEngine] message in
                        mappingEngine?.process(message: message)
                    }
                }
        }
    }
}
