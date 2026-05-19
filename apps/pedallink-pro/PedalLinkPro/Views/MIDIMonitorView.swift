import SwiftUI

/// MIDI 监视器视图
///
/// 实时显示所有接收到的 MIDI 消息，支持过滤和 MIDI 学习模式。
/// 用于调试脚踏板连接和查看传入的 MIDI CC 数据。
struct MIDIMonitorView: View {
    @EnvironmentObject var midiService: MIDIService
    @StateObject private var viewModel = MIDIMonitorViewModel()

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                connectionStatusBar
                filterBar
                messageList
            }
            .navigationTitle("MIDI 监视器")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    HStack(spacing: 12) {
                        Button {
                            viewModel.isPaused.toggle()
                        } label: {
                            Image(systemName: viewModel.isPaused ? "play.fill" : "pause.fill")
                        }

                        Button {
                            midiService.clearMessages()
                        } label: {
                            Image(systemName: "trash")
                        }

                        Button {
                            midiService.refreshDevices()
                        } label: {
                            Image(systemName: "arrow.clockwise")
                        }
                    }
                }
            }
        }
    }

    /// 设备连接状态栏
    private var connectionStatusBar: some View {
        HStack {
            Circle()
                .fill(midiService.isRunning ? AppColors.midiActive : AppColors.muteRed)
                .frame(width: 8, height: 8)

            Text(midiService.isRunning ? "已连接" : "未连接")
                .font(.caption)
                .foregroundColor(.secondary)

            Spacer()

            if midiService.connectedSources.isEmpty {
                Text("未检测到 MIDI 设备")
                    .font(.caption)
                    .foregroundColor(.secondary)
            } else {
                Text("\(midiService.connectedSources.count) 个设备")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            if let lastMsg = midiService.lastMessage {
                MIDIActivityIndicator(message: lastMsg)
            }
        }
        .padding(.horizontal)
        .padding(.vertical, 8)
        .background(AppColors.secondaryBackground)
    }

    /// 消息过滤栏
    private var filterBar: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                FilterChip(
                    title: "全部",
                    isSelected: viewModel.filterType == nil,
                    action: { viewModel.filterType = nil }
                )
                ForEach(MIDIMessageType.allCases, id: \.self) { type in
                    FilterChip(
                        title: type.rawValue,
                        isSelected: viewModel.filterType == type,
                        action: { viewModel.filterType = type }
                    )
                }
            }
            .padding(.horizontal)
            .padding(.vertical, 8)
        }
        .background(AppColors.secondaryBackground.opacity(0.5))
    }

    /// 消息列表
    private var messageList: some View {
        Group {
            if midiService.recentMessages.isEmpty {
                emptyState
            } else {
                let filtered = viewModel.filteredMessages(midiService.recentMessages)
                List(filtered) { message in
                    MIDIMessageRow(message: message)
                        .listRowBackground(Color.clear)
                }
                .listStyle(.plain)
            }
        }
    }

    /// 空状态视图
    private var emptyState: some View {
        VStack(spacing: 16) {
            Spacer()
            Image(systemName: "pianokeys")
                .font(.system(size: 64))
                .foregroundColor(.secondary.opacity(0.5))
            Text("等待 MIDI 信号...")
                .font(.title3)
                .foregroundColor(.secondary)
            Text("连接 MIDI 脚踏板并踩下踏板\n信号将在此处实时显示")
                .font(.caption)
                .foregroundColor(.secondary.opacity(0.7))
                .multilineTextAlignment(.center)
            Spacer()
        }
    }
}

/// MIDI 消息行视图
struct MIDIMessageRow: View {
    let message: MIDIMessage

    var body: some View {
        HStack(spacing: 12) {
            RoundedRectangle(cornerRadius: 4)
                .fill(colorForType(message.type))
                .frame(width: 4, height: 36)

            VStack(alignment: .leading, spacing: 2) {
                Text(message.displayString)
                    .font(.system(.body, design: .monospaced))
                    .foregroundColor(.primary)

                Text(message.sourceName)
                    .font(.caption2)
                    .foregroundColor(.secondary)
            }

            Spacer()

            Text(message.timestamp, style: .time)
                .font(.caption2)
                .foregroundColor(.secondary)
        }
        .padding(.vertical, 4)
    }

    /// 根据消息类型返回对应颜色
    private func colorForType(_ type: MIDIMessageType) -> Color {
        switch type {
        case .controlChange: return .orange
        case .noteOn: return .green
        case .noteOff: return .red
        case .programChange: return .blue
        }
    }
}

/// 过滤标签组件
struct FilterChip: View {
    let title: String
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.caption)
                .fontWeight(isSelected ? .semibold : .regular)
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(isSelected ? Color.orange : AppColors.cardBackground)
                .foregroundColor(isSelected ? .black : .secondary)
                .cornerRadius(16)
        }
    }
}
