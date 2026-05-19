import Foundation
import CoreMIDI
import UIKit

/// 宿主互联服务
///
/// 负责将映射操作转化为目标宿主应用可识别的控制指令。
/// 支持两种通信方式：
/// 1. 虚拟 MIDI 输出（通过 CoreMIDI 虚拟端口发送标准 MIDI 消息）
/// 2. URL Scheme（用于 AUM 等支持 URL 控制的应用）
class HostInteropService {
    private var midiClient: MIDIClientRef = 0
    private var outputPort: MIDIPortRef = 0
    private var virtualSource: MIDIEndpointRef = 0
    private var isSetup = false

    init() {
        setupVirtualMIDISource()
    }

    deinit {
        if virtualSource != 0 {
            MIDIEndpointDispose(virtualSource)
        }
        if midiClient != 0 {
            MIDIClientDispose(midiClient)
        }
    }

    /// 执行宿主操作
    /// - Parameter action: 要执行的操作指令
    func execute(action: HostAction) {
        switch action.hostApp {
        case .aum:
            executeAUMAction(action)
        case .audiobus, .garageBand, .cubasis:
            executeMIDIAction(action)
        case .generic:
            executeMIDIAction(action)
        }
    }

    // MARK: - AUM 专用控制

    /// 通过 URL Scheme 执行 AUM 操作
    ///
    /// AUM 支持通过 URL Scheme 进行外部控制：
    /// `aum://control?command=<cmd>&channel=<ch>`
    private func executeAUMAction(_ action: HostAction) {
        let channel = action.targetChannel

        switch action.actionType {
        case .mute:
            sendAUMURL(command: "toggleMute", channel: channel)
            sendMIDICC(channel: UInt8(channel), cc: 85, value: 127)
        case .solo:
            sendAUMURL(command: "toggleSolo", channel: channel)
            sendMIDICC(channel: UInt8(channel), cc: 86, value: 127)
        case .selectChannel:
            sendAUMURL(command: "selectChannel", channel: channel)
        case .volume:
            let value = UInt8(clamping: action.parameterValue ?? 100)
            sendMIDICC(channel: UInt8(channel), cc: 7, value: value)
        case .pan:
            let value = UInt8(clamping: action.parameterValue ?? 64)
            sendMIDICC(channel: UInt8(channel), cc: 10, value: value)
        case .send:
            let value = UInt8(clamping: action.parameterValue ?? 0)
            sendMIDICC(channel: UInt8(channel), cc: 91, value: value)
        }
    }

    /// 通过 URL Scheme 发送 AUM 控制命令
    /// - Parameters:
    ///   - command: AUM 命令字符串
    ///   - channel: 目标通道号
    private func sendAUMURL(command: String, channel: Int) {
        guard let url = URL(string: "aum://control?command=\(command)&channel=\(channel)") else { return }
        DispatchQueue.main.async {
            UIApplication.shared.open(url, options: [:], completionHandler: nil)
        }
    }

    // MARK: - 通用 MIDI 控制

    /// 通过虚拟 MIDI 输出发送操作（适用于所有支持 MIDI 的宿主）
    private func executeMIDIAction(_ action: HostAction) {
        let channel = UInt8(clamping: action.targetChannel)

        switch action.actionType {
        case .mute:
            sendMIDICC(channel: channel, cc: 85, value: 127)
        case .solo:
            sendMIDICC(channel: channel, cc: 86, value: 127)
        case .selectChannel:
            sendMIDIProgramChange(channel: 0, program: channel)
        case .volume:
            let val = UInt8(clamping: action.parameterValue ?? 100)
            sendMIDICC(channel: channel, cc: 7, value: val)
        case .pan:
            let val = UInt8(clamping: action.parameterValue ?? 64)
            sendMIDICC(channel: channel, cc: 10, value: val)
        case .send:
            let val = UInt8(clamping: action.parameterValue ?? 0)
            sendMIDICC(channel: channel, cc: 91, value: val)
        }
    }

    // MARK: - CoreMIDI 底层操作

    /// 初始化虚拟 MIDI 源
    ///
    /// 创建一个名为 "PedalLink Pro" 的虚拟 MIDI 源，
    /// 其他 MIDI 应用可以将其作为输入源来接收控制信号。
    private func setupVirtualMIDISource() {
        let clientStatus = MIDIClientCreate("PedalLinkPro Output" as CFString, nil, nil, &midiClient)
        guard clientStatus == noErr else { return }

        let sourceStatus = MIDISourceCreateWithProtocol(
            midiClient,
            "PedalLink Pro" as CFString,
            ._1_0,
            &virtualSource
        )

        isSetup = sourceStatus == noErr
    }

    /// 发送 MIDI Control Change 消息
    /// - Parameters:
    ///   - channel: MIDI 通道 (0-15)
    ///   - cc: 控制器编号 (0-127)
    ///   - value: 控制器值 (0-127)
    private func sendMIDICC(channel: UInt8, cc: UInt8, value: UInt8) {
        guard isSetup else { return }
        let status: UInt8 = 0xB0 | (channel & 0x0F)
        sendMIDIBytes([status, cc & 0x7F, value & 0x7F])
    }

    /// 发送 MIDI Program Change 消息
    /// - Parameters:
    ///   - channel: MIDI 通道
    ///   - program: 程序编号
    private func sendMIDIProgramChange(channel: UInt8, program: UInt8) {
        guard isSetup else { return }
        let status: UInt8 = 0xC0 | (channel & 0x0F)
        sendMIDIBytes([status, program & 0x7F])
    }

    /// 发送原始 MIDI 字节数据（通过 UMP 封装）
    /// - Parameter bytes: MIDI 字节数据
    private func sendMIDIBytes(_ bytes: [UInt8]) {
        guard isSetup, bytes.count >= 2 else { return }

        var word: UInt32 = 0x20000000
        word |= UInt32(bytes[0]) << 16
        word |= UInt32(bytes[1]) << 8
        if bytes.count > 2 {
            word |= UInt32(bytes[2])
        }

        var eventList = MIDIEventList()
        var packet = MIDIEventListInit(&eventList, ._1_0)
        packet = MIDIEventListAdd(&eventList, MemoryLayout<MIDIEventList>.size, packet, 0, 1, &word)

        MIDIReceived(virtualSource, &eventList)
    }
}
