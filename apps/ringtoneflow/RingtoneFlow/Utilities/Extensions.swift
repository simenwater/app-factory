import SwiftUI

// MARK: - TimeInterval 格式化

extension TimeInterval {
    /// 将秒数格式化为 "M:SS" 或 "MM:SS" 字符串
    var formattedTime: String {
        let minutes = Int(self) / 60
        let seconds = Int(self) % 60
        return String(format: "%d:%02d", minutes, seconds)
    }

    /// 格式化为 "M:SS.S" 精确到十分之一秒
    var formattedTimePrecise: String {
        let minutes = Int(self) / 60
        let seconds = Int(self) % 60
        let tenths = Int((self.truncatingRemainder(dividingBy: 1)) * 10)
        return String(format: "%d:%02d.%d", minutes, seconds, tenths)
    }
}

// MARK: - Color 主题扩展

extension Color {
    /// 主色调 —— 紫蓝渐变起始色
    static let rfPrimary = Color(red: 0.345, green: 0.380, blue: 0.976)

    /// 次要色 —— 渐变结束色
    static let rfSecondary = Color(red: 0.608, green: 0.318, blue: 0.878)

    /// 波形颜色
    static let rfWaveform = Color(red: 0.439, green: 0.478, blue: 1.0)

    /// 选区颜色
    static let rfSelection = Color(red: 0.345, green: 0.380, blue: 0.976).opacity(0.3)

    /// 背景色（亮色模式）
    static let rfBackground = Color(UIColor.systemBackground)

    /// 卡片背景色
    static let rfCardBackground = Color(UIColor.secondarySystemBackground)

    /// 成功色
    static let rfSuccess = Color(red: 0.204, green: 0.780, blue: 0.349)

    /// 错误色
    static let rfError = Color(red: 0.906, green: 0.298, blue: 0.235)
}

// MARK: - View 修饰符

extension View {
    /// 应用 RingtoneFlow 卡片样式
    func rfCardStyle() -> some View {
        self
            .padding()
            .background(Color.rfCardBackground)
            .cornerRadius(16)
            .shadow(color: Color.black.opacity(0.05), radius: 8, x: 0, y: 2)
    }

    /// 渐变按钮样式
    func rfGradientButton() -> some View {
        self
            .foregroundColor(.white)
            .padding(.horizontal, 24)
            .padding(.vertical, 14)
            .background(
                LinearGradient(
                    gradient: Gradient(colors: [.rfPrimary, .rfSecondary]),
                    startPoint: .leading,
                    endPoint: .trailing
                )
            )
            .cornerRadius(12)
    }
}
