import SwiftUI

/// 映射详情/编辑视图
///
/// 用于创建新映射或编辑已有映射规则。
/// 支持 MIDI Learn（学习模式）自动捕获脚踏板信号。
struct MappingDetailView: View {
    @EnvironmentObject var mappingEngine: MappingEngine
    @EnvironmentObject var midiService: MIDIService
    @Environment(\.dismiss) private var dismiss

    @State var mapping: MIDIMapping
    let isNew: Bool

    @State private var isLearning = false

    var body: some View {
        NavigationStack {
            Form {
                basicSection
                midiInputSection
                actionSection
                triggerSection

                if !isNew {
                    deleteSection
                }
            }
            .navigationTitle(isNew ? "新建映射" : "编辑映射")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("取消") { dismiss() }
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Button("保存") { save() }
                        .fontWeight(.semibold)
                }
            }
        }
    }

    /// 基本信息区域
    private var basicSection: some View {
        Section("基本信息") {
            TextField("映射名称", text: $mapping.name)
            Toggle("启用", isOn: $mapping.isEnabled)
        }
    }

    /// MIDI 输入配置区域
    private var midiInputSection: some View {
        Section {
            Picker("消息类型", selection: $mapping.messageType) {
                ForEach(MIDIMessageType.allCases, id: \.self) { type in
                    Text(type.rawValue).tag(type)
                }
            }

            Picker("MIDI 通道", selection: $mapping.midiChannel) {
                ForEach(0..<16, id: \.self) { ch in
                    Text("通道 \(ch + 1)").tag(UInt8(ch))
                }
            }

            HStack {
                Text("控制器编号")
                Spacer()
                Text("\(mapping.controlNumber)")
                    .foregroundColor(.orange)
                    .font(.system(.body, design: .monospaced))
                Stepper("", value: $mapping.controlNumber, in: 0...127)
                    .labelsHidden()
            }

            Button {
                startLearning()
            } label: {
                HStack {
                    Image(systemName: isLearning ? "antenna.radiowaves.left.and.right" : "graduationcap.fill")
                    Text(isLearning ? "等待 MIDI 输入..." : "MIDI 学习")
                    if isLearning {
                        Spacer()
                        ProgressView()
                    }
                }
            }
            .foregroundColor(.orange)
        } header: {
            Text("MIDI 输入")
        } footer: {
            Text("使用 MIDI 学习模式可自动识别脚踏板信号")
        }
    }

    /// 目标操作配置区域
    private var actionSection: some View {
        Section("目标操作") {
            Picker("宿主应用", selection: $mapping.action.hostApp) {
                ForEach(HostApp.allCases) { app in
                    Text(app.rawValue).tag(app)
                }
            }

            Picker("操作类型", selection: $mapping.action.actionType) {
                ForEach(ChannelActionType.allCases) { action in
                    Label(action.rawValue, systemImage: action.iconName)
                        .tag(action)
                }
            }

            Picker("目标通道", selection: $mapping.action.targetChannel) {
                ForEach(0..<AppConstants.maxHostChannels, id: \.self) { ch in
                    Text("通道 \(ch + 1)").tag(ch)
                }
            }

            if mapping.action.actionType == .volume ||
               mapping.action.actionType == .pan ||
               mapping.action.actionType == .send {
                let paramBinding = Binding<Double>(
                    get: { Double(mapping.action.parameterValue ?? 64) },
                    set: { mapping.action.parameterValue = Int($0) }
                )
                VStack(alignment: .leading) {
                    Text("参数值: \(mapping.action.parameterValue ?? 64)")
                        .font(.caption)
                    Slider(value: paramBinding, in: 0...127, step: 1)
                        .tint(.orange)
                }
            }
        }
    }

    /// 触发模式配置区域
    private var triggerSection: some View {
        Section {
            Picker("触发模式", selection: $mapping.triggerMode) {
                ForEach(TriggerMode.allCases) { mode in
                    Text(mode.rawValue).tag(mode)
                }
            }

            if mapping.triggerMode != .momentary {
                HStack {
                    Text("触发阈值")
                    Spacer()
                    Text("\(mapping.thresholdValue)")
                        .foregroundColor(.orange)
                        .font(.system(.body, design: .monospaced))
                    Stepper("", value: $mapping.thresholdValue, in: 1...127)
                        .labelsHidden()
                }
            }
        } header: {
            Text("触发设置")
        } footer: {
            Text(triggerModeDescription)
        }
    }

    /// 删除区域
    private var deleteSection: some View {
        Section {
            Button(role: .destructive) {
                mappingEngine.deleteMapping(mapping)
                dismiss()
            } label: {
                HStack {
                    Spacer()
                    Label("删除映射", systemImage: "trash")
                    Spacer()
                }
            }
        }
    }

    /// 触发模式说明文字
    private var triggerModeDescription: String {
        switch mapping.triggerMode {
        case .onPress: return "当 MIDI 值 ≥ 阈值时触发（适合单次踩下）"
        case .onRelease: return "当 MIDI 值 < 阈值时触发（适合释放踏板）"
        case .toggle: return "每次踩下切换状态（适合静音/独奏开关）"
        case .momentary: return "持续跟踪值变化（适合表情踏板/音量控制）"
        }
    }

    /// 开始 MIDI 学习模式
    private func startLearning() {
        isLearning = true
        HapticManager.light()

        let originalCallback = midiService.onMIDIMessage
        midiService.onMIDIMessage = { [self] message in
            DispatchQueue.main.async {
                self.mapping.messageType = message.type
                self.mapping.midiChannel = message.channel
                self.mapping.controlNumber = message.number
                self.isLearning = false
                HapticManager.notification(.success)
            }
            midiService.onMIDIMessage = originalCallback
        }
    }

    /// 保存映射
    private func save() {
        if isNew {
            mappingEngine.addMapping(mapping)
        } else {
            mappingEngine.updateMapping(mapping)
        }
        HapticManager.notification(.success)
        dismiss()
    }
}
