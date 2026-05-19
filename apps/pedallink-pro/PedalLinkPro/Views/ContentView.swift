import SwiftUI

/// 主内容视图，使用 TabView 组织三个核心页面
struct ContentView: View {
    @EnvironmentObject var midiService: MIDIService
    @EnvironmentObject var mappingEngine: MappingEngine
    @EnvironmentObject var storeService: StoreKitService
    @State private var selectedTab = 0

    var body: some View {
        TabView(selection: $selectedTab) {
            MIDIMonitorView()
                .tabItem {
                    Label("监视器", systemImage: "waveform")
                }
                .tag(0)

            MappingListView()
                .tabItem {
                    Label("映射", systemImage: "arrow.triangle.swap")
                }
                .tag(1)

            SettingsView()
                .tabItem {
                    Label("设置", systemImage: "gearshape.fill")
                }
                .tag(2)
        }
        .tint(.orange)
    }
}
