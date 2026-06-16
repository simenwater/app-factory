import SwiftUI

/// 内购视图模型
/// 包装 StoreService 并提供 UI 绑定
@MainActor
class StoreViewModel: ObservableObject {
    @Published var storeService = StoreService()

    /// 产品价格显示文本
    var priceText: String {
        guard let product = storeService.product else {
            return "$4.99"
        }
        return product.displayPrice
    }

    /// 产品描述
    var productDescription: String {
        storeService.product?.description ?? "一次性购买，永久解锁无限铃声制作"
    }

    /// 是否已购买
    var isPurchased: Bool {
        storeService.isPurchased
    }

    /// 是否加载中
    var isLoading: Bool {
        storeService.isLoading
    }

    /// 错误消息
    var errorMessage: String? {
        storeService.errorMessage
    }

    /// 发起购买
    func purchase() async -> Bool {
        await storeService.purchase()
    }

    /// 恢复购买
    func restorePurchases() async {
        await storeService.restorePurchases()
    }
}
