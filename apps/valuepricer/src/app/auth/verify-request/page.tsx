import { Mail } from "lucide-react";
import Link from "next/link";

/**
 * @description Verification email sent confirmation page
 */
export default function VerifyRequestPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Mail size={28} className="text-primary" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-text dark:text-text-dark">
          Check Your Email
        </h1>
        <p className="mb-6 text-sm text-text-muted dark:text-text-muted-dark">
          A sign-in link has been sent to your email address. Click the link in the email to sign in to ValuePricer.
        </p>
        <Link
          href="/auth/signin"
          className="text-sm text-primary hover:underline"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
