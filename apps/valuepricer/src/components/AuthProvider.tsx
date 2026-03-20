"use client";

import { SessionProvider } from "next-auth/react";

/**
 * @description NextAuth session provider wrapper for client components
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
