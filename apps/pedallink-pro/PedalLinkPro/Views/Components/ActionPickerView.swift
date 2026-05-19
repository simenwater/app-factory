import SwiftUI

/// 操作类型选择器视图
///
/// 以网格形式展示可用的通道操作类型，
/// 每个操作带有图标和描述。
struct ActionPickerView: View {
    @Binding var selectedAction: ChannelActionType
    let columns = Array(repeating: GridItem(.flexible(), spacing: 12), count: 3)

    var body: some View {
        LazyVGrid(columns: columns, spacing: 12) {
            ForEach(ChannelActionType.allCases) { action in
                ActionCard(
                    action: action,
                    isSelected: selectedAction == action
                ) {
                    selectedAction = action
                    HapticManager.light()
                }
            }
        }
        .padding()
    }
}

/// 操作卡片组件
struct ActionCard: View {
    let action: ChannelActionType
    let isSelected: Bool
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            VStack(spacing: 8) {
                Image(systemName: action.iconName)
                    .font(.title2)
                    .foregroundColor(isSelected ? .white : .orange)

                Text(action.rawValue)
                    .font(.caption)
                    .fontWeight(.medium)
                    .foregroundColor(isSelected ? .white : .primary)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(isSelected ? Color.orange : AppColors.cardBackground)
            )
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(isSelected ? Color.orange : Color.clear, lineWidth: 2)
            )
        }
    }
}
