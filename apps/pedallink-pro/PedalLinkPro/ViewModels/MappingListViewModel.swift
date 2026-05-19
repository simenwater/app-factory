import Foundation
import Combine

/// 映射列表视图模型
class MappingListViewModel: ObservableObject {
    /// 是否显示新建映射弹窗
    @Published var showingAddSheet: Bool = false
    /// 是否显示预设选择器
    @Published var showingPresetPicker: Bool = false
    /// 搜索文本
    @Published var searchText: String = ""
    /// 当前选中的映射（用于编辑）
    @Published var selectedMapping: MIDIMapping?

    /// 根据搜索文本过滤映射列表
    /// - Parameter mappings: 原始映射列表
    /// - Returns: 过滤后的列表
    func filteredMappings(_ mappings: [MIDIMapping]) -> [MIDIMapping] {
        guard !searchText.isEmpty else { return mappings }
        return mappings.filter { mapping in
            mapping.name.localizedCaseInsensitiveContains(searchText) ||
            mapping.action.displayString.localizedCaseInsensitiveContains(searchText)
        }
    }

    /// 创建新映射模板
    /// - Returns: 预填充的新映射规则
    func createNewMapping() -> MIDIMapping {
        MIDIMapping(
            name: "新映射 \(Date().formatted(date: .omitted, time: .shortened))",
            action: HostAction(
                hostApp: .aum,
                actionType: .mute,
                targetChannel: 0
            )
        )
    }
}
