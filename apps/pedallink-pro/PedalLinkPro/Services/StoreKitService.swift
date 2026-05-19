import Foundation
import StoreKit

/// StoreKit 服务层：管理应用内购买（一次性买断）
///
/// PedalLink Pro 使用一次性购买模式 ($9.99)，
/// 购买后解锁全部功能，终身免费更新。
class StoreKitService: ObservableObject {
    /// 是否已解锁专业版
    @Published var isProUnlocked: Bool = false
    /// 可用的产品列表
    @Published var products: [Product] = []
    /// 购买状态
    @Published var purchaseState: PurchaseState = .idle
    /// 错误消息
    @Published var errorMessage: String?

    /// 购买状态枚举
    enum PurchaseState {
        case idle
        case purchasing
        case purchased
        case failed
        case restored
    }

    /// 产品标识符
    static let proProductId = "com.pedallinkpro.unlock"

    private var transactionListener: Task<Void, Error>?

    init() {
        transactionListener = listenForTransactions()
        Task {
            await checkExistingPurchases()
            await loadProducts()
        }
    }

    deinit {
        transactionListener?.cancel()
    }

    /// 加载可用产品
    @MainActor
    func loadProducts() async {
        do {
            let storeProducts = try await Product.products(for: [Self.proProductId])
            products = storeProducts
        } catch {
            errorMessage = "无法加载产品信息: \(error.localizedDescription)"
        }
    }

    /// 执行购买
    /// - Parameter product: 要购买的产品
    @MainActor
    func purchase(_ product: Product) async {
        purchaseState = .purchasing

        do {
            let result = try await product.purchase()

            switch result {
            case .success(let verification):
                let transaction = try checkVerified(verification)
                await transaction.finish()
                isProUnlocked = true
                purchaseState = .purchased

            case .pending:
                purchaseState = .idle

            case .userCancelled:
                purchaseState = .idle

            @unknown default:
                purchaseState = .failed
            }
        } catch {
            errorMessage = "购买失败: \(error.localizedDescription)"
            purchaseState = .failed
        }
    }

    /// 恢复购买
    @MainActor
    func restorePurchases() async {
        do {
            try await AppStore.sync()
            await checkExistingPurchases()
            if isProUnlocked {
                purchaseState = .restored
            }
        } catch {
            errorMessage = "恢复购买失败: \(error.localizedDescription)"
            purchaseState = .failed
        }
    }

    /// 专业版价格显示字符串
    var proPriceString: String {
        products.first?.displayPrice ?? "$9.99"
    }

    // MARK: - Private

    /// 验证交易签名
    private func checkVerified<T>(_ result: VerificationResult<T>) throws -> T {
        switch result {
        case .unverified(_, let error):
            throw error
        case .verified(let safe):
            return safe
        }
    }

    /// 检查已有购买记录
    @MainActor
    private func checkExistingPurchases() async {
        for await result in Transaction.currentEntitlements {
            if case .verified(let transaction) = result {
                if transaction.productID == Self.proProductId {
                    isProUnlocked = true
                    return
                }
            }
        }
    }

    /// 监听交易更新（处理中断购买、家庭共享等场景）
    private func listenForTransactions() -> Task<Void, Error> {
        return Task.detached {
            for await result in Transaction.updates {
                if case .verified(let transaction) = result {
                    if transaction.productID == Self.proProductId {
                        await MainActor.run {
                            self.isProUnlocked = true
                        }
                    }
                    await transaction.finish()
                }
            }
        }
    }
}
