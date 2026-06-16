import SwiftUI

/// 波形可视化视图
/// 显示音频波形并支持裁剪区间的拖拽操作
struct WaveformView: View {
    let waveformData: WaveformData
    @Binding var trimStartRatio: CGFloat
    @Binding var trimEndRatio: CGFloat
    let playbackPosition: CGFloat
    let isPlaying: Bool
    let onTrimStartChanged: (CGFloat) -> Void
    let onTrimEndChanged: (CGFloat) -> Void

    @State private var isDraggingStart = false
    @State private var isDraggingEnd = false

    /// 拖拽手柄的触控热区宽度
    private let handleHitWidth: CGFloat = 30
    /// 手柄的可视宽度
    private let handleVisualWidth: CGFloat = 12

    var body: some View {
        GeometryReader { geometry in
            let width = geometry.size.width
            let height = geometry.size.height

            ZStack(alignment: .leading) {
                waveformBars(width: width, height: height)
                selectionOverlay(width: width, height: height)
                trimHandles(width: width, height: height)
                playbackIndicator(width: width, height: height)
            }
        }
        .frame(height: 120)
    }

    // MARK: - Waveform Bars

    /// 波形柱状图
    @ViewBuilder
    private func waveformBars(width: CGFloat, height: CGFloat) -> some View {
        let barCount = waveformData.samples.count
        guard barCount > 0 else { return }

        let barWidth = width / CGFloat(barCount)

        HStack(alignment: .center, spacing: 0) {
            ForEach(0..<barCount, id: \.self) { index in
                let ratio = CGFloat(index) / CGFloat(barCount)
                let isInSelection = ratio >= trimStartRatio && ratio <= trimEndRatio
                let amplitude = CGFloat(waveformData.samples[index])

                RoundedRectangle(cornerRadius: 1)
                    .fill(isInSelection ? Color.rfWaveform : Color.rfWaveform.opacity(0.25))
                    .frame(
                        width: max(1, barWidth - 1),
                        height: max(2, amplitude * height * 0.9)
                    )
            }
        }
    }

    // MARK: - Selection Overlay

    /// 选区半透明遮罩
    private func selectionOverlay(width: CGFloat, height: CGFloat) -> some View {
        ZStack(alignment: .leading) {
            // 左侧遮罩
            Rectangle()
                .fill(Color.black.opacity(0.3))
                .frame(width: trimStartRatio * width, height: height)

            // 右侧遮罩
            Rectangle()
                .fill(Color.black.opacity(0.3))
                .frame(width: (1 - trimEndRatio) * width, height: height)
                .offset(x: trimEndRatio * width)
        }
    }

    // MARK: - Trim Handles

    /// 裁剪手柄
    private func trimHandles(width: CGFloat, height: CGFloat) -> some View {
        ZStack(alignment: .leading) {
            // 起始手柄
            trimHandle(position: trimStartRatio * width, height: height, isStart: true)
                .gesture(
                    DragGesture()
                        .onChanged { value in
                            isDraggingStart = true
                            let newRatio = max(0, min(value.location.x / width, trimEndRatio - 0.02))
                            onTrimStartChanged(newRatio)
                        }
                        .onEnded { _ in isDraggingStart = false }
                )

            // 结束手柄
            trimHandle(position: trimEndRatio * width, height: height, isStart: false)
                .gesture(
                    DragGesture()
                        .onChanged { value in
                            isDraggingEnd = true
                            let newRatio = min(1, max(value.location.x / width, trimStartRatio + 0.02))
                            onTrimEndChanged(newRatio)
                        }
                        .onEnded { _ in isDraggingEnd = false }
                )
        }
    }

    /// 单个手柄视图
    private func trimHandle(position: CGFloat, height: CGFloat, isStart: Bool) -> some View {
        ZStack {
            // 触控热区
            Rectangle()
                .fill(Color.clear)
                .frame(width: handleHitWidth, height: height)
                .contentShape(Rectangle())

            // 可视手柄
            RoundedRectangle(cornerRadius: 3)
                .fill(Color.rfPrimary)
                .frame(width: handleVisualWidth, height: height)
                .overlay(
                    VStack(spacing: 4) {
                        ForEach(0..<3, id: \.self) { _ in
                            RoundedRectangle(cornerRadius: 1)
                                .fill(Color.white.opacity(0.8))
                                .frame(width: 4, height: 1.5)
                        }
                    }
                )

            // 顶部/底部连接线
            VStack {
                Rectangle()
                    .fill(Color.rfPrimary)
                    .frame(width: isStart ? (handleVisualWidth / 2) : (handleVisualWidth / 2), height: 2)
                    .offset(x: isStart ? handleVisualWidth / 4 : -handleVisualWidth / 4)

                Spacer()

                Rectangle()
                    .fill(Color.rfPrimary)
                    .frame(width: isStart ? (handleVisualWidth / 2) : (handleVisualWidth / 2), height: 2)
                    .offset(x: isStart ? handleVisualWidth / 4 : -handleVisualWidth / 4)
            }
            .frame(height: height)
        }
        .offset(x: position - handleHitWidth / 2)
    }

    // MARK: - Playback Indicator

    /// 播放位置指示线
    @ViewBuilder
    private func playbackIndicator(width: CGFloat, height: CGFloat) -> some View {
        if isPlaying {
            Rectangle()
                .fill(Color.white)
                .frame(width: 2, height: height)
                .shadow(color: .black.opacity(0.3), radius: 2)
                .offset(x: playbackPosition * width)
                .animation(.linear(duration: 0.05), value: playbackPosition)
        }
    }
}
