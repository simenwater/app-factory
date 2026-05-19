import SwiftUI

/// 映射列表视图
///
/// 显示所有已创建的 MIDI 映射规则，支持新建、编辑、删除和排序。
/// 实时高亮当前被触发的映射。
struct MappingListView: View {
    @EnvironmentObject var mappingEngine: MappingEngine
    @EnvironmentObject var storeService: StoreKitService
    @StateObject private var viewModel = MappingListViewModel()

    var body: some View {
        NavigationStack {
            Group {
                if mappingEngine.mappings.isEmpty {
                    emptyState
                } else {
                    mappingList
                }
            }
            .navigationTitle("映射规则")
            .searchable(text: $viewModel.searchText, prompt: "搜索映射...")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    HStack(spacing: 12) {
                        Menu {
                            Button("加载 AUM 预设") {
                                mappingEngine.loadPreset(for: .aum)
                            }
                            Button("加载 Audiobus 预设") {
                                mappingEngine.loadPreset(for: .audiobus)
                            }
                            Button("加载通用预设") {
                                mappingEngine.loadPreset(for: .generic)
                            }
                        } label: {
                            Image(systemName: "tray.and.arrow.down.fill")
                        }

                        Button {
                            if canAddMapping {
                                viewModel.showingAddSheet = true
                            }
                        } label: {
                            Image(systemName: "plus")
                        }
                    }
                }
            }
            .sheet(isPresented: $viewModel.showingAddSheet) {
                MappingDetailView(
                    mapping: viewModel.createNewMapping(),
                    isNew: true
                )
            }
            .sheet(item: $viewModel.selectedMapping) { mapping in
                MappingDetailView(
                    mapping: mapping,
                    isNew: false
                )
            }
        }
    }

    /// 是否可以添加映射（免费版限制）
    private var canAddMapping: Bool {
        storeService.isProUnlocked || mappingEngine.mappings.count < AppConstants.freeMaxMappings
    }

    /// 映射列表
    private var mappingList: some View {
        List {
            if !canAddMapping {
                freeVersionBanner
            }

            ForEach(viewModel.filteredMappings(mappingEngine.mappings)) { mapping in
                MappingRowView(
                    mapping: mapping,
                    isTriggered: mappingEngine.lastTriggeredMappingId == mapping.id,
                    toggleState: mappingEngine.toggleStates["\(mapping.id)_toggle"] ?? false
                )
                .contentShape(Rectangle())
                .onTapGesture {
                    viewModel.selectedMapping = mapping
                }
            }
            .onDelete { offsets in
                mappingEngine.deleteMappings(at: offsets)
            }
            .onMove { source, destination in
                mappingEngine.moveMappings(from: source, to: destination)
            }
        }
        .listStyle(.insetGrouped)
    }

    /// 免费版限制提示
    private var freeVersionBanner: some View {
        HStack {
            Image(systemName: "lock.fill")
                .foregroundColor(.orange)
            VStack(alignment: .leading) {
                Text("免费版限制 \(AppConstants.freeMaxMappings) 个映射")
                    .font(.caption)
                    .fontWeight(.medium)
                Text("升级 Pro 解锁无限映射")
                    .font(.caption2)
                    .foregroundColor(.secondary)
            }
            Spacer()
            Button("升级") {
                if let product = storeService.products.first {
                    Task { await storeService.purchase(product) }
                }
            }
            .buttonStyle(.borderedProminent)
            .tint(.orange)
            .controlSize(.small)
        }
        .padding(.vertical, 4)
    }

    /// 空状态视图
    private var emptyState: some View {
        VStack(spacing: 20) {
            Spacer()
            Image(systemName: "arrow.triangle.swap")
                .font(.system(size: 64))
                .foregroundColor(.secondary.opacity(0.5))
            Text("暂无映射规则")
                .font(.title3)
                .foregroundColor(.secondary)
            Text("创建映射将脚踏板信号\n关联到宿主软件操作")
                .font(.caption)
                .foregroundColor(.secondary.opacity(0.7))
                .multilineTextAlignment(.center)

            VStack(spacing: 12) {
                Button {
                    viewModel.showingAddSheet = true
                } label: {
                    Label("新建映射", systemImage: "plus.circle.fill")
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.borderedProminent)
                .tint(.orange)

                Button {
                    mappingEngine.loadPreset(for: .aum)
                } label: {
                    Label("加载 AUM 预设", systemImage: "tray.and.arrow.down")
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.bordered)
            }
            .padding(.horizontal, 40)

            Spacer()
        }
    }
}

/// 映射行视图
struct MappingRowView: View {
    let mapping: MIDIMapping
    let isTriggered: Bool
    let toggleState: Bool

    var body: some View {
        HStack(spacing: 12) {
            Circle()
                .fill(mapping.isEnabled ? (isTriggered ? .green : .orange) : .gray)
                .frame(width: 10, height: 10)
                .scaleEffect(isTriggered ? 1.5 : 1.0)
                .animation(.easeInOut(duration: 0.15), value: isTriggered)

            VStack(alignment: .leading, spacing: 4) {
                Text(mapping.name)
                    .font(.body)
                    .fontWeight(.medium)
                    .foregroundColor(mapping.isEnabled ? .primary : .secondary)

                HStack(spacing: 6) {
                    Label(
                        "\(mapping.messageType.rawValue) \(mapping.controlNumber)",
                        systemImage: "pianokeys"
                    )
                    .font(.caption2)
                    .foregroundColor(.orange)

                    Image(systemName: "arrow.right")
                        .font(.caption2)
                        .foregroundColor(.secondary)

                    Label(
                        mapping.action.displayString,
                        systemImage: mapping.action.actionType.iconName
                    )
                    .font(.caption2)
                    .foregroundColor(.secondary)
                }
            }

            Spacer()

            if mapping.triggerMode == .toggle {
                Circle()
                    .fill(toggleState ? AppColors.midiActive : AppColors.midiInactive)
                    .frame(width: 12, height: 12)
            }

            Image(systemName: "chevron.right")
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding(.vertical, 4)
        .background(
            RoundedRectangle(cornerRadius: 8)
                .fill(isTriggered ? Color.green.opacity(0.1) : Color.clear)
        )
    }
}
