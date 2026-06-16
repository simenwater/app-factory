import SwiftUI

/// 主内容视图 —— Tab 导航
struct ContentView: View {
    @EnvironmentObject var appState: AppState
    @State private var selectedTab = 0

    var body: some View {
        TabView(selection: $selectedTab) {
            HomeView()
                .tabItem {
                    Label("制作", systemImage: "music.note")
                }
                .tag(0)

            RingtoneListView()
                .tabItem {
                    Label("铃声", systemImage: "list.bullet")
                }
                .tag(1)

            SettingsView()
                .tabItem {
                    Label("设置", systemImage: "gearshape")
                }
                .tag(2)
        }
        .tint(.rfPrimary)
        .sheet(isPresented: Binding(
            get: { !appState.hasSeenOnboarding },
            set: { if !$0 { appState.hasSeenOnboarding = true } }
        )) {
            OnboardingView()
        }
    }
}

/// 已导出铃声列表视图
struct RingtoneListView: View {
    @State private var ringtones: [URL] = []
    @State private var showDeleteAlert = false
    @State private var deleteTarget: URL?

    private let exportService = FileExportService()

    var body: some View {
        NavigationStack {
            Group {
                if ringtones.isEmpty {
                    emptyStateView
                } else {
                    ringtoneList
                }
            }
            .navigationTitle("我的铃声")
            .onAppear { loadRingtones() }
            .alert("删除铃声", isPresented: $showDeleteAlert) {
                Button("删除", role: .destructive) {
                    if let url = deleteTarget {
                        try? exportService.deleteExportedRingtone(at: url)
                        loadRingtones()
                    }
                }
                Button("取消", role: .cancel) {}
            } message: {
                Text("确定要删除这个铃声吗？")
            }
        }
    }

    private var emptyStateView: some View {
        VStack(spacing: 16) {
            Image(systemName: "music.note.list")
                .font(.system(size: 56))
                .foregroundColor(.secondary)

            Text("还没有铃声")
                .font(.title3)
                .fontWeight(.medium)

            Text("制作你的第一个铃声吧！")
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    private var ringtoneList: some View {
        List {
            ForEach(ringtones, id: \.absoluteString) { url in
                HStack {
                    Image(systemName: "music.note")
                        .foregroundColor(.rfPrimary)
                        .frame(width: 32)

                    VStack(alignment: .leading, spacing: 4) {
                        Text(url.deletingPathExtension().lastPathComponent)
                            .font(.body)

                        Text(url.pathExtension.uppercased())
                            .font(.caption2)
                            .foregroundColor(.secondary)
                    }

                    Spacer()

                    ShareLink(item: url) {
                        Image(systemName: "square.and.arrow.up")
                            .foregroundColor(.rfPrimary)
                    }
                }
                .swipeActions(edge: .trailing) {
                    Button(role: .destructive) {
                        deleteTarget = url
                        showDeleteAlert = true
                    } label: {
                        Label("删除", systemImage: "trash")
                    }
                }
            }
        }
    }

    private func loadRingtones() {
        ringtones = exportService.getExportedRingtones()
    }
}

/// 引导页视图
struct OnboardingView: View {
    @EnvironmentObject var appState: AppState
    @State private var currentPage = 0

    private let pages: [(icon: String, title: String, subtitle: String)] = [
        ("waveform.circle.fill", "极简铃声制作", "导入你喜欢的音乐，轻松裁剪为 iPhone 铃声"),
        ("slider.horizontal.3", "精准裁剪", "可视化波形编辑，支持 Fade In/Out 效果"),
        ("checkmark.seal.fill", "无广告 · 无订阅", "一次购买，永久使用\n前 3 次导出完全免费")
    ]

    var body: some View {
        VStack(spacing: 0) {
            TabView(selection: $currentPage) {
                ForEach(0..<pages.count, id: \.self) { index in
                    VStack(spacing: 24) {
                        Spacer()

                        Image(systemName: pages[index].icon)
                            .font(.system(size: 80))
                            .foregroundStyle(
                                LinearGradient(
                                    colors: [.rfPrimary, .rfSecondary],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            )

                        Text(pages[index].title)
                            .font(.title)
                            .fontWeight(.bold)

                        Text(pages[index].subtitle)
                            .font(.body)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 40)

                        Spacer()
                    }
                    .tag(index)
                }
            }
            .tabViewStyle(.page(indexDisplayMode: .always))

            Button {
                if currentPage < pages.count - 1 {
                    withAnimation { currentPage += 1 }
                } else {
                    appState.hasSeenOnboarding = true
                }
            } label: {
                Text(currentPage < pages.count - 1 ? "下一步" : "开始使用")
                    .font(.headline)
                    .frame(maxWidth: .infinity)
                    .rfGradientButton()
            }
            .padding(.horizontal, 24)
            .padding(.bottom, 40)
        }
    }
}
