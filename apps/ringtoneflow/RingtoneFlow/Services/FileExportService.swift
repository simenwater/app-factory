import Foundation
import UIKit

/// 文件导出服务
/// 处理铃声文件导出至 iOS 文件 App
class FileExportService {
    /// 导出错误类型
    enum ExportError: LocalizedError {
        case fileNotFound
        case saveFailed(String)

        var errorDescription: String? {
            switch self {
            case .fileNotFound:
                return "导出文件不存在"
            case .saveFailed(let detail):
                return "保存失败：\(detail)"
            }
        }
    }

    /// 将文件准备至文档目录以供分享
    /// - Parameters:
    ///   - url: 源文件 URL
    ///   - name: 文件名（不含扩展名）
    /// - Returns: 文档目录中的文件 URL
    func prepareForSharing(url: URL, name: String) throws -> URL {
        guard FileManager.default.fileExists(atPath: url.path) else {
            throw ExportError.fileNotFound
        }

        let documentsDir = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
        let exportDir = documentsDir.appendingPathComponent("Ringtones", isDirectory: true)

        try? FileManager.default.createDirectory(at: exportDir, withIntermediateDirectories: true)

        let destinationURL = exportDir
            .appendingPathComponent(name)
            .appendingPathExtension(Constants.exportFileExtension)

        try? FileManager.default.removeItem(at: destinationURL)
        try FileManager.default.copyItem(at: url, to: destinationURL)

        return destinationURL
    }

    /// 获取所有已导出的铃声文件列表
    func getExportedRingtones() -> [URL] {
        let documentsDir = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
        let exportDir = documentsDir.appendingPathComponent("Ringtones", isDirectory: true)

        guard let files = try? FileManager.default.contentsOfDirectory(
            at: exportDir,
            includingPropertiesForKeys: [.creationDateKey],
            options: .skipsHiddenFiles
        ) else {
            return []
        }

        return files
            .filter { $0.pathExtension == Constants.exportFileExtension }
            .sorted { url1, url2 in
                let date1 = (try? url1.resourceValues(forKeys: [.creationDateKey]).creationDate) ?? Date.distantPast
                let date2 = (try? url2.resourceValues(forKeys: [.creationDateKey]).creationDate) ?? Date.distantPast
                return date1 > date2
            }
    }

    /// 删除已导出的铃声文件
    func deleteExportedRingtone(at url: URL) throws {
        try FileManager.default.removeItem(at: url)
    }

    /// 铃声设置教程步骤
    static let setupTutorialSteps: [(icon: String, title: String, description: String)] = [
        (
            icon: "square.and.arrow.up",
            title: "1. 导出铃声",
            description: "点击「导出到文件」将 .m4r 铃声保存到「文件」App。"
        ),
        (
            icon: "doc.on.doc",
            title: "2. 打开 GarageBand",
            description: "打开 GarageBand → 长按铃声文件 → 选择「共享」→「电话铃声」。"
        ),
        (
            icon: "gear",
            title: "3. 设置铃声",
            description: "前往「设置」→「声音与触感」→「电话铃声」→ 选择你的铃声。"
        ),
        (
            icon: "checkmark.circle",
            title: "完成！",
            description: "享受你的个性化铃声吧！也可以将其设置为闹钟或特定联系人的铃声。"
        )
    ]
}
