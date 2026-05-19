import SwiftUI

/// 踏板按钮组件
///
/// 模拟物理脚踏板外观的圆形按钮，用于 UI 测试和虚拟触发。
/// 支持按下/释放动画和触感反馈。
struct PedalButton: View {
    let title: String
    let subtitle: String
    let isActive: Bool
    let color: Color
    let action: () -> Void

    @State private var isPressed = false

    var body: some View {
        Button(action: {
            HapticManager.medium()
            action()
        }) {
            VStack(spacing: 6) {
                ZStack {
                    Circle()
                        .fill(
                            RadialGradient(
                                gradient: Gradient(colors: [
                                    color.opacity(isActive ? 0.8 : 0.3),
                                    color.opacity(isActive ? 0.4 : 0.1)
                                ]),
                                center: .center,
                                startRadius: 5,
                                endRadius: 35
                            )
                        )
                        .frame(width: 70, height: 70)
                        .overlay(
                            Circle()
                                .stroke(color.opacity(isActive ? 1.0 : 0.3), lineWidth: 2)
                        )
                        .shadow(
                            color: isActive ? color.opacity(0.6) : .clear,
                            radius: 10
                        )
                        .scaleEffect(isPressed ? 0.92 : 1.0)

                    Image(systemName: isActive ? "power.circle.fill" : "power.circle")
                        .font(.title2)
                        .foregroundColor(isActive ? .white : color.opacity(0.5))
                }

                Text(title)
                    .font(.caption2)
                    .fontWeight(.medium)
                    .foregroundColor(.primary)

                Text(subtitle)
                    .font(.system(size: 9))
                    .foregroundColor(.secondary)
            }
        }
        .buttonStyle(PedalButtonStyle())
    }
}

/// 踏板按钮样式（处理按下效果）
struct PedalButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
            .animation(.easeInOut(duration: 0.1), value: configuration.isPressed)
    }
}
