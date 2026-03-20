"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Mail, Loader2, ArrowRight } from "lucide-react";

/**
 * @description Email magic link sign-in page
 */
export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("email", {
        email,
        redirect: false,
        callbackUrl: "/",
      });
      if (result?.error) {
        setError("Something went wrong. Please try again.");
      } else {
        setIsSent(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isSent) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail size={28} className="text-primary" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-text dark:text-text-dark">
            Check Your Email
          </h1>
          <p className="mb-4 text-sm text-text-muted dark:text-text-muted-dark">
            We sent a magic link to <strong>{email}</strong>. Click the link in the email to sign in.
          </p>
          <button
            onClick={() => setIsSent(false)}
            className="text-sm text-primary hover:underline"
          >
            Use a different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="mb-1 text-3xl font-bold text-primary">ValuePricer</h1>
          <p className="text-sm text-text-muted dark:text-text-muted-dark">
            Sign in to save your pricing analyses
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-text dark:text-text-dark">
              Email Address
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-text-muted-dark"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-lg border border-border bg-surface py-2.5 pl-10 pr-3 text-sm text-text transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-surface-dark dark:text-text-dark"
                autoFocus
              />
            </div>
            {error && <p className="mt-1 text-xs text-danger">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-white shadow-md transition-colors hover:bg-primary-dark disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Continue with Email
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-text-muted dark:text-text-muted-dark">
          We&apos;ll send you a magic link to sign in. No password needed.
        </p>
      </div>
    </div>
  );
}
