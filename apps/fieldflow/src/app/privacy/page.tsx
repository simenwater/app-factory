import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — FieldFlow",
};

/**
 * @description 隐私政策页面（App Store 必须要求）
 */
export default function PrivacyPolicyPage() {
  return (
    <div className="px-4 pt-6 pb-10">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/settings"
          className="text-primary hover:underline text-sm"
        >
          &larr; Settings
        </Link>
      </div>
      <h1 className="mb-6 text-2xl font-bold">Privacy Policy</h1>
      <p className="mb-2 text-xs text-text-muted dark:text-text-muted-dark">
        Last updated: March 2026
      </p>

      <div className="space-y-5 text-sm leading-relaxed text-text-muted dark:text-text-muted-dark">
        <section>
          <h2 className="mb-2 text-base font-semibold text-text dark:text-text-dark">
            1. Overview
          </h2>
          <p>
            FieldFlow (&quot;the App&quot;) is a field service management tool
            designed for small businesses and solo contractors. We are committed
            to protecting your privacy and being transparent about our data
            practices.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-text dark:text-text-dark">
            2. Data Collection &amp; Storage
          </h2>
          <p>
            All data you enter into FieldFlow — including jobs, invoices,
            customer information, and business settings — is stored{" "}
            <strong>locally on your device</strong> using browser storage
            (localStorage). We do not transmit, collect, or store your data on
            any external server.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-text dark:text-text-dark">
            3. No Third-Party Analytics
          </h2>
          <p>
            FieldFlow does not use any third-party analytics, tracking, or
            advertising services. We do not collect usage analytics, device
            identifiers, or location data.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-text dark:text-text-dark">
            4. Data Sharing
          </h2>
          <p>
            We do not share, sell, or transfer your data to any third parties.
            When you use the Share feature to send invoices, data is shared
            directly from your device via the operating system&apos;s native
            sharing mechanism.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-text dark:text-text-dark">
            5. Data Export &amp; Deletion
          </h2>
          <p>
            You can export all your data at any time from the Settings page. To
            delete your data, clear the app&apos;s storage through your
            browser&apos;s settings or use the browser&apos;s &quot;Clear Site
            Data&quot; function.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-text dark:text-text-dark">
            6. Children&apos;s Privacy
          </h2>
          <p>
            FieldFlow is not directed at children under the age of 13. We do not
            knowingly collect personal information from children.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-text dark:text-text-dark">
            7. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes
            will be reflected on this page with an updated revision date.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-text dark:text-text-dark">
            8. Contact
          </h2>
          <p>
            If you have questions about this Privacy Policy, please reach out to
            us through the App&apos;s support channels.
          </p>
        </section>
      </div>
    </div>
  );
}
