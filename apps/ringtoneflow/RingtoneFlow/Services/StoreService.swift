import StoreKit
import Foundation

/// StoreKit 内购服务
/// 管理一次性付费解锁
@MainActor
class StoreService: ObservableObject {
    /// 内购产品
    @Published var product: Product?

    /// 是否已购买
    @Published var isPurchased: Bool = false

    /// 加载状态
    @Published var isLoading: Bool = false

    /// 错误消息
    @Published var errorMessage: String?

    private var transactionListener: Task<Void, Error>?

    init() {
        transactionListener = listenForTransactions()
        Task {
            await loadProduct()
            await updatePurchaseStatus()
        }
    }

    deinit {
        transactionListener?.cancel()
    }

    /// 加载产品信息
    func loadProduct() async {
        isLoading = true
        do {
            let products = try await Product.products(for: [Constants.proUnlockProductID])
            product = products.first
        } catch {
            errorMessage = "无法加载产品信息：\(error.localizedDescription)"
        }
        isLoading = false
    }

    /// 发起购买
    /// - Returns: 是否购买成功
    func purchase() async -> Bool {
        guard let product = product else {
            errorMessage = "产品信息未加载"
            return false
        }

        isLoading = true
        defer { isLoading = false }

        do {
            let result = try await product.purchase()

            switch result {
            case .success(let verification):
                let transaction = try checkVerified(verification)
                isPurchased = true
                await transaction.finish()
                return true

            case .userCancelled:
                return false

            case .pending:
                errorMessage = "购买待确认，请稍后检查"
                return false

            @unknown default:
                errorMessage = "未知购买状态"
                return false
            }
        } catch {
            errorMessage = "购买失败：\(error.localizedDescription)"
            return false
        }
    }

    /// 恢复购买
    func restorePurchases() async {
        isLoading = true
        defer { isLoading = false }

        do {
            try await AppStore.sync()
            await updatePurchaseStatus()
        } catch {
            errorMessage = "恢复购买失败：\(error.localizedDescription)"
        }
    }

    /// 更新购买状态
    private func updatePurchaseStatus() async {
        for await result in Transaction.currentEntitlements {
            if case .verified(let transaction) = result {
                if transaction.productID == Constants.proUnlockProductID {
                    isPurchased = true
                    return
                }
            }
        }
    }

    /// 验证交易
    private func checkVerified<T>(_ result: VerificationResult<T>) throws -> T {
        switch result {
        case .unverified:
            throw StoreError.verificationFailed
        case .verified(let item):
            return item
        }
    }

    /// 监听交易更新
    private func listenForTransactions() -> Task<Void, Error> {
        Task.detached {
            for await result in Transaction.updates {
                if case .verified(let transaction) = result {
                    if transaction.productID == Constants.proUnlockProductID {
                        await MainActor.run {
                            self.isPurchased = true
                        }
                    }
                    await transaction.finish()
                }
            }
        }
    }

    /// 内购错误类型
    enum StoreError: LocalizedError {
        case verificationFailed

        var errorDescription: String? {
            switch self {
            case .verificationFailed:
                return "交易验证失败"
            }
        }
    }
}
