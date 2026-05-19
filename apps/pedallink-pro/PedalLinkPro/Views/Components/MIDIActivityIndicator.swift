import SwiftUI

/// MIDI 信号活动指示器
///
/// 在接收到 MIDI 消息时闪烁，提供直观的实时反馈。
struct MIDIActivityIndicator: View {
    let message: MIDIMessage
    @State private var isAnimating = false

    var body: some View {
        HStack(spacing: 4) {
            Circle()
                .fill(colorForType(message.type))
                .frame(width: 6, height: 6)
                .scaleEffect(isAnimating ? 1.5 : 1.0)
                .opacity(isAnimating ? 1.0 : 0.5)

            Text(message.type.rawValue)
                .font(.system(size: 9, weight: .medium, design: .monospaced))
                .foregroundColor(.secondary)
        }
        .onChange(of: message.id) { _, _ in
            withAnimation(.easeOut(duration: 0.15)) {
                isAnimating = true
            }
            withAnimation(.easeIn(duration: 0.3).delay(0.15)) {
                isAnimating = false
            }
        }
    }

    /// 根据消息类型返回颜色
    private func colorForType(_ type: MIDIMessageType) -> Color {
        switch type {
        case .controlChange: return .orange
        case .noteOn: return .green
        case .noteOff: return .red
        case .programChange: return .blue
        }
    }
}
